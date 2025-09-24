interface HeaderProps {
    title: string;
    description?: string;
}



export function Header({ title, description }: HeaderProps) {
    return (
        <header className="border-b border-slate-200 pb-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
                {title}
            </h1>
            <p className="mt-1 text-slate-500">
                {description}
            </p>
        </header>
    )
}