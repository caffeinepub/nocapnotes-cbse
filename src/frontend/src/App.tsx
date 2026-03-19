import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import ChapterDetailPage from "./pages/ChapterDetailPage";
import HomePage from "./pages/HomePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import PdfViewerPage from "./pages/PdfViewerPage";
import SamplePapersPage from "./pages/SamplePapersPage";
import SearchPage from "./pages/SearchPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import SubjectsPage from "./pages/SubjectsPage";

function LayoutComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: LayoutComponent });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const subjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects",
  component: SubjectsPage,
});
const subjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects/$id",
  component: SubjectDetailPage,
});
const chapterDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chapters/$id",
  component: ChapterDetailPage,
});
const noteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes/$id",
  component: NoteDetailPage,
});
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});
const papersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/papers",
  component: SamplePapersPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const pdfViewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pdf-viewer",
  component: PdfViewerPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  subjectsRoute,
  subjectDetailRoute,
  chapterDetailRoute,
  noteDetailRoute,
  searchRoute,
  papersRoute,
  adminRoute,
  pdfViewerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
