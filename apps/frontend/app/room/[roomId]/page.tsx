import CanvasRoom from "@/components/CanvasRoom";

async function page({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;
  return (
    <div className="w-full h-full">
        <CanvasRoom roomId={roomId}/>
    </div>
  );
}

export default page;