# 💬 Chatbot Flow Builder

A simple yet extensible **Chatbot Flow Builder** built using **React** and **React Flow**.  
It allows you to visually design chatbot message flows by connecting message nodes together — similar to tools like Dialogflow or ManyChat.

🔗 **Live Demo:** [https://chatbot-flow-builder-sable-theta.vercel.app/](https://chatbot-flow-builder-sable-theta.vercel.app/)

---

## 🚀 Features

### 🧩 1. Nodes Panel
- Displays all node types supported by the flow builder.  
- Currently includes only the **Text Message Node**.  
- Designed to be **easily extensible** — future nodes like “Image”, “Button”, or “Delay” can be added with minimal changes.

### 💬 2. Text Node
- Represents a single chatbot message.  
- Can be connected with other nodes to define a conversation flow.  
- Supports editing message text via the **Settings Panel**.

### 🔗 3. Edges & Handles
- **Source Handle:** One outgoing edge per node (enforced).
- **Target Handle:** Can have multiple incoming edges.
- Ensures logical, directional message flow.

### ⚙️ 4. Settings Panel
- Appears when a node is selected.  
- Allows editing node text and deleting the selected node.  
- Replaces the Nodes Panel when active.

### 💾 5. Save Flow
- Validates the flow on save:
  - If there is more than one node, at most one node can have an empty source handle.
  - Shows an error if multiple nodes are disconnected.
- Displays a success message if validation passes.

---

## 🧱 Tech Stack

| Technology | Purpose |
|-------------|----------|
| ⚛️ React | JavaScript Library for Building UIs |
| 🧠 React Flow | Visual node-based flow management |
| 🎨 CSS / Flexbox | Layout and styling |
| 🆔 UUID | Unique ID generation for nodes |
| 🚀 Vercel | Hosting platform |
