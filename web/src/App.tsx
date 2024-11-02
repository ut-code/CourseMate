// export default function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Root />,
//       errorElement: (
//         <div>
//           Sorry, an unexpected error has occurred.{" "}
//           <Link href="/home">Go Back</Link>
//         </div>
//       ),
//       children: [
//         {
//           index: true,
//           element: <Navigate to="/home" replace />,
//         },
//         {
//           path: "home",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Home />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "friends",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Friends />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "settings",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Settings />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "settings/profile",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Profile />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "settings/contact",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Contact />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "settings/aboutUs",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <AboutUs />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "settings/disclaimer",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Disclaimer />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "settings/delete",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <DeleteAccount />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "chat",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <Chat />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "chat/:friendId",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <RoomWindow />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "edit/profile",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <EditProfile />
//             </NavigateByAuthState>
//           ),
//         },
//         {
//           path: "edit/courses",
//           element: (
//             <NavigateByAuthState type="toLoginForUnauthenticated">
//               <EditCourses />
//             </NavigateByAuthState>
//           ),
//         },
//       ],
//     },
//     {
//       path: "/login",
//       element: (
//         <NavigateByAuthState type="toHomeForAuthenticated">
//           <Login />
//         </NavigateByAuthState>
//       ),
//     },
//     {
//       path: "/signup",
//       element: <RegistrationPage />,
//     },
//     {
//       path: "/faq",
//       element: <FAQ />,
//     },
//     {
//       path: "/tutorial",
//       element: <Tutorial />,
//     },
//     {
//       path: "*",
//       element: (
//         <div>
//           お探しのリンクは見つかりませんでした。 <Link href="/home">戻る</Link>
//         </div>
//       ),
//     },
//   ]);

//   return (
//   );
// }
