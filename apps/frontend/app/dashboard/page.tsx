"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Clock,
  Trash2,
  Search,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Room = {
  id: string;
  name: string;
  lastEdited: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const userName = useRef<string>(" ")

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteRoom = (id: string) => {
    axios
      .delete("http://localhost:8000/api/v1/room/delete", {
        data: { id },
        withCredentials: true,
      })
      .then(() => setRooms(rooms.filter((room) => room.id !== id)))
      .catch((error) => console.log("handleDeleteRoom error: ", error));
  };

  const handleCreateRoom = () => {
    axios
      .post("http://localhost:8000/api/v1/room/create", null, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        router.push(`/room/${response.data.data.id}`);
      })
      .catch((error) => console.log("handleCreateRoom error: ", error));
  };

  const handleLogOut = () => {
    axios
      .get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      })
      .then(() => router.replace(`/`))
      .catch((error) => console.log("handleLogOut error: ", error));
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/user/auth-check", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        userName.current = response.data.data.name
        axios
          .get("http://localhost:8000/api/v1/room/get", {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response);
            setRooms(response.data.data);
          });
      })
      .catch(() => router.replace("/auth"));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Sketch Canvas</h1>

          <div className="flex items-center gap-6">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search canvases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                <Settings className="w-5 h-5" />
              </button> */}
              <button
                onClick={handleLogOut}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                {userName.current[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Mobile Search */}
        <div className="mb-6 relative md:hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search canvases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
          />
        </div>

        {/* Page name & Create Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Canvases</h2>
            <p className="text-muted-foreground mt-1">
              Manage and create new drawing canvases
            </p>
          </div>
          <button
            onClick={handleCreateRoom}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Canvas
          </button>
        </div>

        {/* Grid of Rooms/Canvases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-transparent border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer transition-colors h-64"
          >
            <button
              // href="/room/1"
              onClick={handleCreateRoom}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <p className="font-medium">Create New Canvas</p>
              <p className="text-sm mt-1">Start from scratch</p>
            </button>
          </motion.div>

          {/* Room Cards */}
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative group">
                <img
                  src={`https://placehold.co/600x400/9b87f5/ffffff?text=${room.name}`}
                  alt={room.name}
                  className="w-full h-40 object-cover"
                />
                <Link href={`/room/${room.id}`} className="text-white">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span>
                      Open
                      <ArrowUpRight className="w-4 h-4 inline ml-1" />
                    </span>
                    {/* <div className="relative">
                    <button className="text-white p-1 rounded-full hover:bg-white/20">
                    <MoreVertical className="w-4 h-4" />
                    </button>
                    </div> */}
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{room.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Edited {room.lastEdited}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              No canvases found
            </h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery
                ? `No results found for "${searchQuery}". Try a different search term.`
                : "You haven't created any canvases yet. Create your first canvas to get started!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-primary hover:underline"
              >
                Clear search
              </button>
            )}
            {!searchQuery && (
              <button
                // href="/room/1"
                onClick={handleCreateRoom}
                className=" border-2 mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Canvas
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
