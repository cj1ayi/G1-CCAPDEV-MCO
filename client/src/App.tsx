import './App.css'
import ComponentShowcase from './pages/ComponentShowcase';

const App = () => {

   const showShowcase = import.meta.env.DEV;

   if (showShowcase)
       return <ComponentShowcase />

   return (
       <div className="min-h-screen">
       {    }
        <h1>AnimoForums</h1>
       </div>
   )
}

export default App
