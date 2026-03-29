/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Ideas from './pages/Ideas';
import IdeaDetail from './pages/IdeaDetail';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/idea/:id" element={<IdeaDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
