import { Routes, Route } from 'react-router-dom';
import BlueprintsGallery from './pages/BlueprintsGallery';
import BlueprintDetail from './pages/BlueprintDetail';
import BlueprintCreate from './pages/BlueprintCreate';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<BlueprintsGallery />} />
      <Route path='/blueprints/new' element={<BlueprintCreate />} />
      <Route path='/blueprints/:id' element={<BlueprintDetail />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
}
