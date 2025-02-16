interface HeaderSectionProps {
    icon: React.ReactNode;
    title: string;
    subTitle: string;
}

const HeaderSection = ({ icon, title, subTitle }: HeaderSectionProps) => {
    return (
        <div className="max-w-7xl mx-auto py-10">
            <div className="">
                <span>{icon}</span>
                <span>{subTitle}</span>
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
    );
};

export default HeaderSection;
