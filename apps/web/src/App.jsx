import ClientPortalPage from "./pages/ClientPortalPage";
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import LibraryPage from './pages/LibraryPage';
import ConsultationPage from './pages/ConsultationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SuccessPage from './pages/SuccessPage';
import MembersPage from './pages/MembersPage';
import ApplyPage from './pages/ApplyPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <div className="flex min-h-screen flex-col">
                    <SiteHeader />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/resources" element={<ResourcesPage />} />
                            <Route path="/library" element={<LibraryPage />} />
                            <Route path="/consultation" element={<ConsultationPage />} />
                            <Route path="/apply" element={<ApplyPage />} />
                            <Route
                                path="/members"
                                element={
                                    <ProtectedRoute>
                                        <MembersPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/success" element={<SuccessPage />} />
                            <Route path="/portal" element={<ClientPortalPage />} />
        <Route path="*" element={<HomePage />} />
                        </Routes>
                    </main>
                    <SiteFooter />
                </div>
                <Toaster />
            </Router>
        </AuthProvider>
    );
}

export default App;
