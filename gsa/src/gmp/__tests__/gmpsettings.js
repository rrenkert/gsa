/* Copyright (C) 2018-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import GmpSettings, {
  DEFAULT_MANUAL_URL,
  DEFAULT_RELOAD_INTERVAL,
  DEFAULT_PROTOCOLDOC_URL,
  DEFAULT_LOG_LEVEL,
  DEFAULT_RELOAD_INTERVAL_ACTIVE,
  DEFAULT_RELOAD_INTERVAL_INACTIVE,
} from 'gmp/gmpsettings';

const createStorage = state => {
  const store = {
    ...state,
    setItem: jest.fn((name, value) => (store[name] = '' + value)),
    removeItem: jest.fn(name => delete store[name]),
  };
  return store;
};

describe('GmpSettings tests', () => {
  test('should init with defaults', () => {
    const storage = createStorage();
    const settings = new GmpSettings(storage);

    expect(settings.disableLoginForm).toEqual(false);
    expect(settings.enableStoreDebugLog).toBeUndefined();
    expect(settings.guestUsername).toBeUndefined();
    expect(settings.guestPassword).toBeUndefined();
    expect(settings.loglevel).toEqual(DEFAULT_LOG_LEVEL);
    expect(settings.locale).toBeUndefined();
    expect(settings.manualUrl).toEqual(DEFAULT_MANUAL_URL);
    expect(settings.manualLanguageMapping).toBeUndefined();
    expect(settings.protocol).toEqual('http:');
    expect(settings.protocoldocurl).toEqual(DEFAULT_PROTOCOLDOC_URL);
    expect(settings.reloadInterval).toEqual(DEFAULT_RELOAD_INTERVAL);
    expect(settings.reloadIntervalActive).toEqual(
      DEFAULT_RELOAD_INTERVAL_ACTIVE,
    );
    expect(settings.reloadIntervalInactive).toEqual(
      DEFAULT_RELOAD_INTERVAL_INACTIVE,
    );
    expect(settings.server).toEqual('localhost');
    expect(settings.token).toBeUndefined();
    expect(settings.timeout).toBeUndefined();
    expect(settings.timezone).toBeUndefined();
    expect(settings.username).toBeUndefined();
    expect(settings.vendorVersion).toBeUndefined();
    expect(settings.vendorLabel).toBeUndefined();

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('loglevel', DEFAULT_LOG_LEVEL);
  });

  test('should init with passed options', () => {
    const storage = createStorage();
    const settings = new GmpSettings(storage, {
      disableLoginForm: true,
      enableGreenboneSensor: true,
      enableStoreDebugLog: true,
      guestUsername: 'guest',
      guestPassword: 'pass',
      locale: 'en',
      loglevel: 'error',
      manualUrl: 'http://manual',
      manualLanguageMapping: {
        foo: 'bar',
      },
      protocol: 'http',
      protocoldocurl: 'http://protocol',
      reloadInterval: 10,
      reloadIntervalActive: 5,
      reloadIntervalInactive: 60,
      server: 'localhost',
      token: 'atoken',
      timeout: 30000,
      timezone: 'cet',
      username: 'foo',
      vendorVersion: 'foo',
      vendorLabel: 'foo.bar',
    });

    expect(settings.disableLoginForm).toEqual(true);
    expect(settings.enableGreenboneSensor).toEqual(true);
    expect(settings.enableStoreDebugLog).toEqual(true);
    expect(settings.guestUsername).toEqual('guest');
    expect(settings.guestPassword).toEqual('pass');
    expect(settings.locale).toBeUndefined();
    expect(settings.loglevel).toEqual('error');
    expect(settings.manualUrl).toEqual('http://manual');
    expect(settings.manualLanguageMapping).toEqual({foo: 'bar'});
    expect(settings.protocol).toEqual('http');
    expect(settings.protocoldocurl).toEqual('http://protocol');
    expect(settings.reloadInterval).toEqual(10);
    expect(settings.reloadIntervalActive).toEqual(5);
    expect(settings.reloadIntervalInactive).toEqual(60);
    expect(settings.server).toEqual('localhost');
    expect(settings.token).toBeUndefined();
    expect(settings.timeout).toEqual(30000);
    expect(settings.timezone).toBeUndefined();
    expect(settings.username).toBeUndefined();
    expect(settings.vendorVersion).toEqual('foo');
    expect(settings.vendorLabel).toEqual('foo.bar');

    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      'enableStoreDebugLog',
      '1',
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(2, 'loglevel', 'error');
  });

  test('should init from store', () => {
    const storage = createStorage({
      enableStoreDebugLog: '0',
      locale: 'en',
      loglevel: 'error',
      timezone: 'cet',
      token: 'atoken',
      username: 'foo',
    });

    const settings = new GmpSettings(storage, {
      // pass server and protocol. location defaults may not reliable on
      // different test environments
      server: 'foo',
      protocol: 'http',
    });

    expect(settings.enableGreenboneSensor).toEqual(false);
    expect(settings.enableStoreDebugLog).toEqual(false);
    expect(settings.locale).toEqual('en');
    expect(settings.loglevel).toEqual('error');
    expect(settings.manualUrl).toEqual(DEFAULT_MANUAL_URL);
    expect(settings.manualLanguageMapping).toBeUndefined();
    expect(settings.protocol).toEqual('http');
    expect(settings.protocoldocurl).toEqual(DEFAULT_PROTOCOLDOC_URL);
    expect(settings.reloadInterval).toEqual(DEFAULT_RELOAD_INTERVAL);
    expect(settings.reloadIntervalActive).toEqual(
      DEFAULT_RELOAD_INTERVAL_ACTIVE,
    );
    expect(settings.reloadIntervalInactive).toEqual(
      DEFAULT_RELOAD_INTERVAL_INACTIVE,
    );
    expect(settings.server).toEqual('foo');
    expect(settings.token).toEqual('atoken');
    expect(settings.timeout).toBeUndefined();
    expect(settings.timezone).toEqual('cet');
    expect(settings.username).toEqual('foo');

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('loglevel', 'error');
  });

  test('should ensure options override settings from storage', () => {
    const storage = createStorage({
      enableStoreDebugLog: '0',
      locale: 'de',
      loglevel: 'error',
      manualUrl: 'http://ipsum',
      manualLanguageMapping: {lorem: 'ipsum'},
      protocol: 'https',
      protocoldocurl: 'http://lorem',
      reloadInterval: 20,
      reloadIntervalActive: 20,
      reloadIntervalInactive: 20,
      server: 'foo.bar',
      token: 'btoken',
      timeout: 10000,
      timezone: 'cest',
      username: 'bar',
      vendorVersion: 'foo',
      vendorLabel: 'foo.bar',
    });

    const settings = new GmpSettings(storage, {
      enableStoreDebugLog: true,
      locale: 'en',
      loglevel: 'debug',
      manualUrl: 'http://manual',
      manualLanguageMapping: {foo: 'bar'},
      protocol: 'http',
      protocoldocurl: 'http://protocol',
      reloadInterval: 10,
      reloadIntervalActive: 5,
      reloadIntervalInactive: 60,
      server: 'localhost',
      token: 'atoken',
      timeout: 30000,
      timezone: 'cet',
      username: 'foo',
      vendorVersion: 'bar',
      vendorLabel: 'bar.foo',
    });

    expect(settings.enableStoreDebugLog).toEqual(true);
    expect(settings.locale).toEqual('de');
    expect(settings.loglevel).toEqual('debug');
    expect(settings.manualUrl).toEqual('http://manual');
    expect(settings.manualLanguageMapping).toEqual({foo: 'bar'});
    expect(settings.protocol).toEqual('http');
    expect(settings.protocoldocurl).toEqual('http://protocol');
    expect(settings.reloadInterval).toEqual(10);
    expect(settings.reloadIntervalActive).toEqual(5);
    expect(settings.reloadIntervalInactive).toEqual(60);
    expect(settings.server).toEqual('localhost');
    expect(settings.token).toEqual('btoken');
    expect(settings.timeout).toEqual(30000);
    expect(settings.timezone).toEqual('cest');
    expect(settings.username).toEqual('bar');
    expect(settings.vendorVersion).toEqual('bar');
    expect(settings.vendorLabel).toEqual('bar.foo');

    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      'enableStoreDebugLog',
      '1',
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(2, 'loglevel', 'debug');
  });

  test('should delete settings from storage', () => {
    const storage = createStorage({
      enableStoreDebugLog: '1',
      locale: 'en',
      loglevel: 'error',
      token: 'atoken',
      timezone: 'cet',
      username: 'foo',
    });

    const settings = new GmpSettings(storage, {});

    expect(settings.enableStoreDebugLog).toEqual(true);
    expect(settings.locale).toEqual('en');
    expect(settings.loglevel).toEqual('error');
    expect(settings.token).toEqual('atoken');
    expect(settings.timezone).toEqual('cet');
    expect(settings.username).toEqual('foo');

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('loglevel', 'error');

    settings.enableStoreDebugLog = undefined;
    expect(storage.removeItem).toBeCalledWith('enableStoreDebugLog');

    settings.locale = undefined;
    expect(storage.removeItem).toBeCalledWith('locale');

    settings.loglevel = undefined;
    expect(storage.removeItem).toBeCalledWith('loglevel');

    settings.token = undefined;
    expect(storage.removeItem).toBeCalledWith('token');

    settings.timezone = undefined;
    expect(storage.removeItem).toBeCalledWith('timezone');

    settings.username = undefined;
    expect(storage.removeItem).toBeCalledWith('username');
  });

  test('should freeze properties', () => {
    const storage = createStorage();
    const settings = new GmpSettings(storage, {
      disableLoginForm: true,
      enableGreenboneSensor: true,
      guestUsername: 'guest',
      guestPassword: 'pass',
      locale: 'en',
      loglevel: 'error',
      manualUrl: 'http://manual',
      manualLanguageMapping: {foo: 'bar'},
      protocol: 'http',
      protocoldocurl: 'http://protocol',
      reloadInterval: 10,
      server: 'localhost',
      token: 'atoken',
      timeout: 30000,
      timezone: 'cet',
      username: 'foo',
      vendorVersion: 'foobar',
      vendorLabel: 'foo.bar',
    });

    expect(() => {
      settings.disableLoginForm = false;
    }).toThrow();
    expect(settings.disableLoginForm).toEqual(true);
    expect(() => {
      settings.enableGreenboneSensor = false;
    }).toThrow();
    expect(settings.enableGreenboneSensor).toEqual(true);
    expect(() => {
      settings.guestUsername = 'foo';
    }).toThrow();
    expect(settings.guestUsername).toEqual('guest');
    expect(() => {
      settings.guestPassword = 'foo';
    }).toThrow();
    expect(settings.guestPassword).toEqual('pass');
    expect(() => {
      settings.manualUrl = 'foo';
    }).toThrow();
    expect(settings.manualUrl).toEqual('http://manual');
    expect(() => {
      settings.manualLanguageMapping = {lorem: 'ipsum'};
    }).toThrow();
    expect(settings.manualLanguageMapping).toEqual({foo: 'bar'});
    expect(() => {
      settings.protocoldocurl = 'foo';
    }).toThrow();
    expect(settings.protocoldocurl).toEqual('http://protocol');
    expect(() => {
      settings.server = 'foo';
    }).toThrow();
    expect(settings.server).toEqual('localhost');
    expect(() => {
      settings.protocol = 'foo';
    }).toThrow();
    expect(settings.protocol).toEqual('http');
    expect(() => {
      settings.vendorVersion = 'barfoo';
    }).toThrow();
    expect(settings.vendorVersion).toEqual('foobar');
    expect(() => {
      settings.vendorLabel = 'bar.foo';
    }).toThrow();
    expect(settings.vendorLabel).toEqual('foo.bar');
  });
});

// vim: set ts=2 sw=2 tw=80:
