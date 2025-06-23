type PackagesIndexHeaderProps = {
    title?: string;
}

export default function PackagesIndexHeader({
    title
}: PackagesIndexHeaderProps) {
  return (
     <header className="mb-6">
        <div className="m-8">
            <div className="relative w-full h-54 rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0">
                    <img 
                        src="https://nolisoli.ph/wp-content/uploads/2019/07/rizalbuild3-620x414.jpg"
                        className="absolute inset-0 bg-black/40 w-full h-full object-cover object-center" 
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h1 className="text-white text-5xl uppercase font-bold">{ title || 'Packages' }</h1>
                </div>
            </div>
        </div>
    </header>
  )
}