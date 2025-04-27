import { Element, Shape } from "@/types";
import axios from "axios";
import {
  ArrowLeft,
  Circle,
  Eraser,
  Minus,
  MousePointer,
  Pencil,
  Router,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

function ToolKit({
  roomId,
  shape,
  setShape,
  setNewSelectedElem,
  zoom,
  setZoom,
  setPan,
  canvas,
}: {
  roomId: string;
  shape: Shape;
  setShape: Dispatch<SetStateAction<Shape>>;
  setNewSelectedElem: Dispatch<SetStateAction<Element | null>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  setPan: Dispatch<
    SetStateAction<{
      X: number;
      Y: number;
    }>
  >;
  canvas: HTMLCanvasElement | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleNameEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.target.blur();
    }
  };
  const handleNameBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0 && e.target.value != name) {
      axios
        .patch(
          "http://localhost:8000/api/v1/room/name",
          { name: e.target.value, roomId },
          { withCredentials: true }
        )
        .then((response) => {
          // TODO: Alert the user for successful name change
          setName(response.data.data.name);
        })
        .catch((error) => {
          // TODO: Alert the user for unsuccessful name change
          console.log("handleEnter error: ", error);
        });
    } else {
      e.target.placeholder = name;
    }
  };
  const handleNameFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length == 0) {
      e.target.placeholder = "";
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/room/get/${roomId}`)
      .then((response) => {
        setName((prev) => response.data.data.name);
        axios
          .get("http://localhost:8000/api/v1/user/auth-check", {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.data.id == response.data.data.userId) setIsAdmin(true);
            else setIsAdmin(false);
          })
          .catch(() => setIsAdmin(false));
      })
      .catch((err) => {
        console.log("UseEffect error: ", err);
      });
  }, []);

  if (!canvas) return null;
  return (
    <>
      <div className="fixed top-4 left-4 flex bg-[#232329] rounded-lg overflow-hidden items-center justify-center">
        {isAdmin && <button
          className={`p-2.5 hover:bg-[#31303B]`}
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <ArrowLeft size={24} />
        </button>}
        <input
          type="text"
          className={`border-none outline-none bg-transparent shadow-none text- p-2.5 w-full h-full placeholder:text-current ${isAdmin? null: " cursor-pointer"}`}
          onKeyDown={handleNameEnter}
          onBlur={handleNameBlur}
          onFocus={handleNameFocus}
          placeholder={name}
          disabled={!isAdmin}
        />
      </div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-1 bg-[#232329] text-xs rounded-lg p-1">
        <button
          className={` p-2.5 rounded-lg ${shape === "selection" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            canvas.style.cursor = "default";
            setShape("selection");
          }}
        >
          <MousePointer
            size={13}
            fill={`${shape === "selection" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "rect" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("rect");
          }}
        >
          <Square
            size={13}
            fill={`${shape === "rect" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "ellipse" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("ellipse");
          }}
        >
          <Circle
            size={13}
            fill={`${shape === "ellipse" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={`p-2.5 rounded-lg ${shape === "line" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("line");
          }}
        >
          <Minus
            size={13}
            fill={`${shape === "line" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "pencil" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("pencil");
          }}
        >
          <Pencil size={13} />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "eraser" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("eraser");
          }}
        >
          <Eraser size={13} />
        </button>
        <button
          className="hover:bg-[#31303B] py-2.5 rounded-lg px-3.5"
          onClick={() => {
            setZoom(1);
            setPan({ X: 0, Y: 0 });
          }}
        >
          {zoom > 30 ? 3000 : zoom < 0.1 ? 10 : Math.trunc(zoom * 100)}%
        </button>
      </div>
    </>
  );
}

export default ToolKit;
