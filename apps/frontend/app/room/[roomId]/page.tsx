import CanvasRoom from "@/components/CanvasRoom";

const page = async ({ params }: { params: { roomId: string } }) => {
  const roomId = (await params).roomId;
  // const response = await axios.get("http://localhost:8000/api/v1/user/auth-check", {
  //     withCredentials: true,
  //   })
  // console.log(response);

  return (
    <div className="w-full h-full">
      <CanvasRoom roomId={roomId} />
    </div>
  );
};

export default page;
