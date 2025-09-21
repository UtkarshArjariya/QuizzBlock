const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying QuizBlock contracts...");

  // Deploy Reward Token first
  console.log("📝 Deploying Reward Token...");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("✅ Reward Token deployed to:", rewardTokenAddress);

  // Deploy QuizBlock contract
  console.log("🎯 Deploying QuizBlock contract...");
  const QuizBlock = await ethers.getContractFactory("QuizBlock");
  const quizBlock = await QuizBlock.deploy(rewardTokenAddress);
  await quizBlock.waitForDeployment();
  const quizBlockAddress = await quizBlock.getAddress();
  console.log("✅ QuizBlock deployed to:", quizBlockAddress);

  // Transfer ownership and mint initial tokens
  console.log("🔧 Setting up contracts...");
  
  // Mint initial tokens to QuizBlock contract
  const initialSupply = ethers.parseEther("1000000"); // 1M tokens
  await rewardToken.mint(quizBlockAddress, initialSupply);
  console.log("✅ Minted 1M tokens to QuizBlock contract");

  // Create some sample quizzes
  console.log("📚 Creating sample quizzes...");
  
  const sampleQuiz1 = {
    title: "Web3 Fundamentals",
    category: "Blockchain",
    questions: [
      "What does Web3 stand for?",
      "Which consensus mechanism does Ethereum use?",
      "What is a smart contract?"
    ],
    correctAnswers: [
      "Decentralized Web",
      "Proof of Stake",
      "Self-executing contract with terms in code"
    ],
    timeLimit: 300, // 5 minutes
    entryFee: ethers.parseEther("1"), // 1 token
    rewardPool: ethers.parseEther("10") // 10 tokens
  };

  const sampleQuiz2 = {
    title: "DeFi Protocols",
    category: "DeFi",
    questions: [
      "What does DeFi stand for?",
      "Which protocol is known for yield farming?",
      "What is an AMM?"
    ],
    correctAnswers: [
      "Decentralized Finance",
      "Compound",
      "Automated Market Maker"
    ],
    timeLimit: 300,
    entryFee: ethers.parseEther("2"),
    rewardPool: ethers.parseEther("20")
  };

  // Create quizzes
  await quizBlock.createQuiz(
    sampleQuiz1.title,
    sampleQuiz1.category,
    sampleQuiz1.questions,
    sampleQuiz1.correctAnswers,
    sampleQuiz1.timeLimit,
    sampleQuiz1.entryFee,
    sampleQuiz1.rewardPool
  );

  await quizBlock.createQuiz(
    sampleQuiz2.title,
    sampleQuiz2.category,
    sampleQuiz2.questions,
    sampleQuiz2.correctAnswers,
    sampleQuiz2.timeLimit,
    sampleQuiz2.entryFee,
    sampleQuiz2.rewardPool
  );

  console.log("✅ Created sample quizzes");

  // Create a live event
  console.log("🎪 Creating live event...");
  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 3600; // 1 hour from now
  const endTime = startTime + 7200; // 2 hours duration

  await quizBlock.createLiveEvent(
    "Web3 Master Challenge",
    "Ultimate Web3 knowledge test with big prizes!",
    startTime,
    endTime,
    100, // max participants
    ethers.parseEther("5"), // entry fee
    ethers.parseEther("1000") // prize pool
  );

  console.log("✅ Created live event");

  // Output deployment info
  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("Reward Token Address:", rewardTokenAddress);
  console.log("QuizBlock Address:", quizBlockAddress);
  console.log("Network:", await ethers.provider.getNetwork().then(n => n.name));
  console.log("=====================================");
  
  console.log("\n📋 Next Steps:");
  console.log("1. Update contract addresses in lib/wagmi-config.ts");
  console.log("2. Verify contracts on Avalanche Explorer");
  console.log("3. Test the quiz functionality");
  console.log("4. Deploy to mainnet when ready");

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork().then(n => n.name),
    chainId: await ethers.provider.getNetwork().then(n => n.chainId),
    rewardToken: rewardTokenAddress,
    quizBlock: quizBlockAddress,
    deployedAt: new Date().toISOString(),
    deployer: await ethers.provider.getSigner().getAddress()
  };

  require('fs').writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
