import { UserCircle } from "lucide-react";


export default function Navbar() {
return (
<header className="w-full bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
<h1 className="text-2xl font-bold text-gray-800 tracking-tight">Authentik Portal</h1>
<UserCircle className="w-8 h-8 text-gray-700" />
</header>
)
}