
interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  imageNode: React.ReactNode; // Passing the mock UI as a node
  reverse?: boolean; // Controls left/right alignment
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  subtitle,
  description,
  imageNode,
  reverse = false,
}) => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
        {/* Text Content */}
        <div className="flex-1 space-y-4">
          <h3 className="text-cyan-400 font-semibold tracking-wide uppercase text-sm">{title}</h3>
          <h2 className="text-4xl font-bold text-white">{subtitle}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
        </div>
        
        {/* UI Mockup Container */}
        <div className="flex-1 w-full bg-gray-800/50 rounded-2xl p-1 border border-gray-700 shadow-2xl">
          {imageNode}
        </div>
      </div>
    </section>
  );
};