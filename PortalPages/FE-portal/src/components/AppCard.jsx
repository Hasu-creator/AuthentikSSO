import { ArrowUpRight } from "lucide-react";


export default function AppCard({ name, description, url, icon }) {
return (
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4">
<div className="flex items-center gap-3">
<div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
{icon}
</div>
<h2 className="text-lg font-semibold text-gray-900">{name}</h2>
</div>


<p className="text-gray-600 text-sm leading-relaxed">{description}</p>


<a href={url} target="_blank" className="flex items-center gap-1 text-blue-600 font-medium mt-auto hover:underline">
Open <ArrowUpRight className="w-4 h-4" />
</a>
</div>
)
}