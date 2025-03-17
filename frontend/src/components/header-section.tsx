interface HeaderSectionProps {
    icon: React.ReactNode;
    title: string;
    subTitle: string;
}

const HeaderSection = ({ icon, title, subTitle }: HeaderSectionProps) => {
    return (
        <div className="py-12 text-center">
            <div
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full 
                text-blue-600 font-medium mb-4"
            >
                <span>{icon}</span>
                <span>{title}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {subTitle}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
    );
};

export default HeaderSection;
