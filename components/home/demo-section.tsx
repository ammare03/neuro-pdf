import { Pizza } from "lucide-react";
import SummaryViewer from "../summaries/summary-viewer";
import { MotionDiv } from "../common/motion-wrapper";

const DEMO_SUMMARY = `# 🤖 Cracking the Code of Intelligent Agents 🧠
- 🚀 Intelligent agents perceive their environment and act rationally to achieve goals.
- 📌 Understanding agent types and their environments is crucial for effective AI design.

# Document Details
- 📄 Type: Lecture Outline/Presentation
- 🎯 For: AI Students/Enthusiasts

# Key Highlights
- 💡 Defining Intelligent Agents & Rationality
- ⚙️ Understanding PEAS (Performance, Environment, Actuators, Sensors)
- 📚 Exploring Different Agent Types (Reflex, Model-Based, Goal-Based, Utility-Based)

# Why It Matters
- 🔍 Understanding intelligent agents is crucial for developing AI systems that can solve complex problems, automate tasks, and interact with the world in a smart and efficient way. This knowledge helps in designing robots, virtual assistants, and other AI applications that can perceive, reason, and act autonomously.

# Main Points
- 🧠 Agents use sensors to perceive and actuators to act in an environment.
- 💪 Rational agents maximize performance based on percepts and built-in knowledge.
- 🔥 PEAS framework helps specify agent design (Performance, Environment, Actuators, Sensors).

# Pro Tips
- ⭐ Define the agent's goals and performance measures clearly.
- 🌟 Choose the right sensors and actuators for the task.
- ✨ Consider the environment type (observable, deterministic, etc.) for optimal design.

# Key Terms to Know
- 🧾 **PEAS:** Framework for specifying agent design: Performance measure, Environment, Actuators, Sensors.
- 📘 **Rationality:** Agent's ability to choose actions that maximize expected performance.

# Bottom Line
- 🟢 Intelligent agents are designed to perceive, reason, and act rationally in their environment to achieve specific goals.`;

export default function DemoSection() {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-500" />
          </div>
          <div className="text-center mb-16">
            <h3 className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">
              Watch how NeuroPDF transforms{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                this AI Agents PDF
              </span>{" "}
              into an easy summary reel!
            </h3>
          </div>
        </div>

        <div className="flex justify-center items-center px-2 sm:px-4 lg:px-6">
          <SummaryViewer summary={DEMO_SUMMARY} />
        </div>
      </div>
    </section>
  );
}
