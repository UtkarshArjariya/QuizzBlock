import React from 'react';

// Inline SVG icons
const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M11.54 22.351A2.454 2.454 0 0 1 11.54 18v-2.731a5.613 5.613 0 0 0-4.73 1.258A2.455 2.455 0 0 1 3 16.5V9.457c0-1.285.673-2.454 1.79-3.111l4.98-2.876a4.582 4.582 0 0 1 4.59 0l4.98 2.876c1.117.657 1.79 1.826 1.79 3.111V16.5c0 .762-.31 1.48-.845 2.012a2.455 2.455 0 0 1-4.73 1.258V18a2.454 2.454 0 0 1-.035 4.351Z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H2.25ZM.75 8.625a.75.75 0 0 1 .75-.75h14.25a.75.75 0 0 1 .75.75v10.375a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1-.75-.75V8.625ZM1.5 8.625h14.25V19.5H1.5V8.625Z" />
    <path d="M12.625 15.75a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a5.25 5.25 0 0 0 10.5 0v-3c0-2.9-2.35-5.25-5.25-5.25ZM3 16.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-3Z" clipRule="evenodd" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" />
    <path d="M12 1.5a.75.75 0 0 1 .75.75v19.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Z" />
    <path d="M1.5 12a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-1.5Z" />
  </svg>
);

const features = [
  {
    icon: <AwardIcon />,
    title: "Instant Rewards",
    description: "Winners receive crypto prizes directly to their wallet, powered by smart contracts on Avalanche.",
  },
  {
    icon: <LockIcon />,
    title: "On-Chain & Transparent",
    description: "All quizzes, scores, and prize pools are stored on the blockchain for verifiable fairness.",
  },
  {
    icon: <CommunityIcon />,
    title: "Community-Powered",
    description: "Anyone can create and host quizzes, turning their knowledge into a rewarding experience.",
  },
  {
    icon: <WalletIcon />,
    title: "Secure & Decentralized",
    description: "Kwizi is built for Web3, giving you full control over your assets with no central authority.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="px-8 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-4">Why Kwizi?</h2>
        <p className="text-lg text-gray-600 mb-12">The next generation of on-chain quizzing.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
              <div className="text-blue-600 mb-4 flex justify-center text-3xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
