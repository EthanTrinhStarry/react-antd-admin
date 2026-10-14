'use client';

import 'dayjs/locale/zh-cn';
import './mock';

import { App as AntdApp, ConfigProvider, Spin, theme as antdTheme } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { history, HistoryRouter } from '@/routes/history';
import store from '@/stores';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { setUserItem } from '@/stores/user.store';
import { setMessageApi } from '@/utils/antd-message';
import { getGlobalState } from '@/utils/getGloabal';
import { browserStorage, STORAGE_KEYS } from '@/utils/storage';

import { localeConfig, LocaleFormatter } from './locales';
import RenderRouter from './routes';
import { setGlobalState } from './stores/global.store';

const AntdMessageBridge: React.FC = () => {
  const { message } = AntdApp.useApp();

  useEffect(() => {
    setMessageApi(message);

    return () => setMessageApi();
  }, [message]);

  return null;
};

const ClientStateHydrator: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setTheme = (dark: boolean) => {
      dispatch(
        setGlobalState({
          theme: dark ? 'dark' : 'light',
        }),
      );
    };

    const username = browserStorage.get(STORAGE_KEYS.username) || '';
    const savedLocale = browserStorage.get(STORAGE_KEYS.locale);
    const savedRole = browserStorage.get(STORAGE_KEYS.role);
    const legacyRole = username === 'admin' || username === 'guest' ? username : '';
    const role = savedRole === 'admin' || savedRole === 'guest' ? savedRole : legacyRole;

    dispatch(
      setUserItem({
        hydrated: true,
        ...getGlobalState(),
        locale: savedLocale === 'zh_CN' ? 'zh_CN' : 'en_US',
        newUser: browserStorage.getBoolean(STORAGE_KEYS.newUser, true),
        logged: Boolean(browserStorage.get(STORAGE_KEYS.token)),
        username,
        role,
      }),
    );

    const savedTheme = browserStorage.get(STORAGE_KEYS.theme);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    setTheme(savedTheme === 'dark' || (savedTheme !== 'light' && mql.matches));

    if (savedTheme !== 'dark' && savedTheme !== 'light') {
      const matchMode = (event: MediaQueryListEvent) => setTheme(event.matches);

      mql.addEventListener('change', matchMode);

      return () => mql.removeEventListener('change', matchMode);
    }
  }, [dispatch]);

  return null;
};

interface AppProps {
  initialPath: string;
}

const AppContent: React.FC<AppProps> = ({ initialPath }) => {
  const { locale } = useAppSelector(state => state.user);
  const { theme, loading } = useAppSelector(state => state.global);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      dayjs.locale('en');
    } else if (locale === 'zh_CN') {
      dayjs.locale('zh-cn');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'zh_CN') {
      return zhCN;
    }
  };

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      componentSize="middle"
      theme={{
        token: { colorPrimary: '#13c2c2' },
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <AntdApp className="app-container">
        <AntdMessageBridge />
        <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
          <HistoryRouter history={history} initialPath={initialPath}>
            <Suspense fallback={null}>
              <ClientStateHydrator />
              {loading && (
                <Spin
                  fullscreen
                  spinning
                  className="app-loading-wrapper"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.44)' : 'rgba(255, 255, 255, 0.44)',
                  }}
                  description={<LocaleFormatter id="gloabal.tips.loading" />}
                />
              )}
              <RenderRouter />
            </Suspense>
          </HistoryRouter>
        </IntlProvider>
      </AntdApp>
    </ConfigProvider>
  );
};

const App: React.FC<AppProps> = props => (
  <Provider store={store}>
    <AppContent {...props} />
  </Provider>
);

export default App;
