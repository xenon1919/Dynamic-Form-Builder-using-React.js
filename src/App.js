import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DynamicForm from "./components/DynamicForm";
import "./styles/main.css";

function App() {
  return (
    <div>
      <Header />
      <main className="main-content">
        <DynamicForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
