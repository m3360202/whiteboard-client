//**  Import react */
import React, { Suspense, useEffect } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

//**  Import i18n */
import store, { RootState } from '../store';

import { lazy } from 'react';
//**  Import mui */
import { ThemeProvider } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import lightTheme from '../mui/theme/lightTheme';

//**  Import components */

import SystemInit from '../startup/systemInit';



const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem(
        'page-has-been-force-refreshed'
      ) || 'false'
    );

    try {
      const component = await componentImport();

      window.localStorage.setItem(
        'page-has-been-force-refreshed',
        'false'
      );

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.localStorage.setItem(
          'page-has-been-force-refreshed',
          'true'
        );
        return window.location.reload();
      }

      // The page has already been reloaded
      // Assuming that user is already using the latest version of the application.
      // Let's let the application crash and raise the error.
      throw error;
    }
  });


const AuthPageSignIn = lazyWithRetry(
  () => import('../pages/signin/AuthPageSignIn')
);
const EmailVerified = lazyWithRetry(() => import('../pages/signin/EmailVerified'));
const VerifyEmail = lazyWithRetry(() => import('../pages/signin/verifyEmail'));
const AuthPageSignInWithWechat = lazyWithRetry(
  () => import('../pages/signin/AuthPageSignInWithWechat')
);
const AuthPageSignInWithLinkedin = lazyWithRetry(
  () => import('../pages/signin/AuthPageSignInWithLinkedin')
);
const AuthPageJoin = lazyWithRetry(() => import('../pages/join/AuthPageJoin'));
const InviteJoinPage = lazyWithRetry(() => import('../pages/join/InviteJoin'));
const ResetPassword = lazyWithRetry(
  () => import('../pages/resetPassword/ResetPassword')
);

const RoomHome = lazyWithRetry(() => import('../pages/roomHome/RoomHome'));
const RecentPageContainer = lazyWithRetry(
  () => import('../pages/recentPage/RecentPageContainer')
);
const FavoritesBoardPage = lazyWithRetry(
  () => import('../pages/favoritesBoardPage/FavoritesBoardPage')
);
// import OrgSettingPageContainer from '../pages/orgSettingPage/OrgSettingPageContainer';
const OrgSettingPageContainer = lazyWithRetry(
  () => import('../pages/orgSettingPage/OrgSettingPageContainer')
);
 
const AiAssistantPage = lazyWithRetry(
  () => import('../pages/aiAssistantPage/AiAssistantPage')
);
const AppsStorePage = lazyWithRetry(
  () => import('../pages/appsStore/AppsStorePage')
);
const PromptPage = lazyWithRetry(() => import('../pages/promptPage/PromptPage'));
const DeleteBoardPage = lazyWithRetry(
  () => import('../pages/deleteBoardPage/DeleteBoardPage')
);
const UserAccount = lazyWithRetry(
  () => import('../pages/userAccount/UserAccount')
);
const UserProfileAndSettingsPage = lazyWithRetry(
  () =>
    import(
      '../components/user/userProfileAndSettings/UserProfileAndSettingsPage'
    )
);

// import BoardPage from '../pages/board/BoardPage';
const BoardPage = lazyWithRetry(() => import('../pages/board/BoardPage'));
const PricingPage = lazyWithRetry(() => import('../pages/pricing/Pricing'));
const PurchaseItemPage = lazyWithRetry(
  () => import('../pages/pricing/PurchaseItem')
);
const AdminPage = lazyWithRetry(() => import('../pages/admin/AdminPage'));
const NotFound = lazyWithRetry(() => import('../pages/404/NotFoundPage'));

let timer = null;

const LoadingPage = () => {

  return <Backdrop open={true} invisible={true}></Backdrop>;
};

function App() {
  useEffect(() => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      const loading = document.getElementById('loading');
      if (!loading) return;
      document.getElementById('loading').style.display = 'none';
      clearTimeout(timer);
    }, 3000);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Suspense fallback={<LoadingPage />}>
            <SystemInit>
              <Switch>
                {/*main pages*/}

                <Route exact component={() => <RecentPageContainer />} path="/" />
                <Route
                  exact
                  component={() => <RecentPageContainer />}
                  path="/recent"
                />
                <Route exact component={() => <RoomHome />} path="/room/:id" />
                <Route exact component={() => <BoardPage />} path="/board/:id" />
                <Route exact component={() => <AdminPage />} path="/admin" />
                <Route
                  exact
                  component={() => <FavoritesBoardPage />}
                  path="/favorite"
                />
                <Route
                  exact
                  component={() => <DeleteBoardPage />}
                  path="/delete"
                />
         
                <Route
                  exact
                  component={() => <AiAssistantPage />}
                  path="/aiassistant"
                />
                <Route
                  exact
                  component={() => <AppsStorePage />}
                  path="/appsStore"
                />
                <Route exact component={() => <PromptPage />} path="/prompt" />
                <Route
                  exact
                  component={() => <OrgSettingPageContainer />}
                  path="/teamsetting"
                />
                <Route exact component={() => <UserAccount />} path="/account" />
                <Route
                  exact
                  component={() => <UserProfileAndSettingsPage />}
                  path="/profile"
                />
                {/*sign in and sign up pages*/}
                <Route component={() => <AuthPageSignIn />} path="/signin" />
                <Route
                  component={() => <AuthPageSignInWithWechat />}
                  path="/wechat"
                />
                <Route
                  component={() => <AuthPageSignInWithLinkedin />}
                  path="/singinWithLinkedin"
                />
                <Route component={() => <AuthPageJoin />} path="/join" />
                <Route
                  component={() => <ResetPassword />}
                  path="/reset-password/:token"
                />
                {/*verify pages*/}
                <Route
                  component={() => <EmailVerified />}
                  path="/emailVerified"
                />
                <Route
                  component={() => <VerifyEmail />}
                  path="/verify-email/:id"
                />

                {/*invite pages*/}
                <Route
                  component={() => <InviteJoinPage />}
                  path="/invite/:hash"
                />
                {/*purchase pages*/}
                <Route component={() => <PricingPage />} path="/pricing" />
                <Route
                  component={() => <PurchaseItemPage />}
                  path="/purchaseItem"
                />


                {/*404 page*/}
                <Route component={() => <NotFound />} path="*" />
              </Switch>
            </SystemInit>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;


