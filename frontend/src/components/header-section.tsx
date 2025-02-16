interface HeaderSectionProps {
    icon: React.ReactNode;
    title: string;
    subTitle: string;
}

const HeaderSection = ({ icon, title, subTitle }: HeaderSectionProps) => {
    return (
        <div className="py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>{icon}</span>
                <span>{title}</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-500 ">{subTitle}</h2>
        </div>
    );
};

export default HeaderSection;
