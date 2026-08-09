import type { Metadata } from "next";
import { UniversalLab } from "@/components/universal-lab";

export const metadata: Metadata = {
  title: "Universal debugging playground",
  description: "Switch between Python, Node.js, JavaScript, Git, PowerShell, CMD, VS Code, and Bash error simulations.",
};

export default function PlaygroundPage() {
  return <UniversalLab />;
}
