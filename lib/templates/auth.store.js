<% if (options.token.enabled && options.token.cookie) { %>
  import Cookie from 'cookie'
  import Cookies from 'js-cookie'
  <% } %>
  import md5 from 'md5'
  
  export default {
    namespaced: true,
  
    state: () => ({
      <% if (options.token.enabled) { %>token: null,<% } %>
      <% if (options.user.enabled) { %>user: null<% } %>
    }),
  
    getters: {
      loggedIn (state) {
        return Boolean(state.user<% if (options.token.enabled) { %> && state.token<% } %>)
      }
    },
  
    mutations: {
      <% if (options.user.enabled) { %>
      // SET_USER
      SET_USER (state, user) {
        state.user = user
      },
      <% } %>
  
      <% if (options.token.enabled) { %>
      // SET_TOKEN
      SET_TOKEN (state, token) {
        state.token = token
      }
      <% } %>
    },
  
    actions: {
      <% if (options.token.enabled) { %>
      // Update token
      async updateToken ({ commit }, token) {
        // Update token in store's state
        commit('SET_TOKEN', token)
  
        // Set Authorization token for all axios requests
        this.$axios.setToken(token, '<%= options.token.type %>')
  
        <% if (options.token.localStorage) { %>
        // Update localStorage
        if (process.browser && localStorage) {
          if (token) {
            localStorage.setItem('<%= options.token.name %>', token)
          } else {
            localStorage.removeItem('<%= options.token.name %>')
          }
        }
        <% } %>
  
        <% if (options.token.cookie) { %>
        // Update cookies
        if (process.browser) {
          // ...Browser
          if (token) {
            Cookies.set('<%= options.token.cookieName %>', token)
          } else {
            Cookies.remove('<%= options.token.cookieName %>')
          }
        } else {
          // ...Server
          let params = {
            domain: '/'
          }
          if (!token) {
            let expires
            let date = new Date()
            expires = date.setDate(date.getDate() - 1)
            params.expires = new Date(expires)
          }
          this.app.context.res.setHeader('Set-Cookie', Cookie.serialize('<%= options.token.cookieName %>', token, params))
        }
        <% } %>
      },
      <% } %>
  
      <% if (options.token.enabled) { %>
      // Fetch Token
      async fetchToken ({ dispatch }) {
        let token
  
        <% if (options.token.localStorage) { %>
        // Try to extract token from localStorage
        if (process.browser && localStorage) {
          token = localStorage.getItem('<%= options.token.name %>')
        }
        <% } %>
  
        <% if (options.token.cookie) { %>
        // Try to extract token from cookies
        if (!token) {
          const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie
          const cookies = Cookie.parse(cookieStr || '') || {}
          token = cookies['<%= options.token.cookieName %>']
        }
        <% } %>
  
        if (token) {
          await dispatch('updateToken', token)
        }
      },
      <% } %>
  
      // Reset
      async reset ({ dispatch, commit }) {
        <% if (options.user.enabled) { %>commit('SET_USER', null)<% } %>
        <% if (options.token.enabled) { %>await dispatch('updateToken', null)<% } %>
      },
  
      <% if (options.user.enabled) { %>
      // Fetch
      async fetch ({ getters, state, commit, dispatch }, { endpoint = '<%= options.user.endpoint %>' } = {}) {
        <% if (options.token.enabled) { %>
        // Fetch and update latest token
        await dispatch('fetchToken')
  
        // Skip if there is no token set
        if (!state.token) {
          return
        }
        <% } %>
  
        // Try to get user profile
        try {
          let data = {}
          // 请求头配置
          let headerConfig  = {}
          if (endpoint = '/api/account') {
            getuuid()
            headerConfig = {
              headers: {
                fingerprint: localStorage.getItem('fingerPrintHash')
              }
            }
          }
          data = await this.$axios.$<%= options.user.method.toLowerCase() %>(endpoint,headerConfig)
          commit('SET_USER', data<%= options.user.propertyName ? ('[\'' + options.user.propertyName + '\']') : '' %>)
        } catch (e) {
          console.error(e)
          <% if (options.user.resetOnFail) { %>
          // Reset store
          await dispatch('reset')
          <% } %>
        }
      },
      <% } %>
  
      // Login
      async login ({ dispatch }, { fields, endpoint = '<%= options.login.endpoint %>' } = {}) {
        // Send credentials to API
        let data = await this.$axios.$post(endpoint, fields)
  
        <% if (options.token.enabled) { %>
        await dispatch('updateToken', data['<%= options.token.name %>'])
        <% } %>
  
        // Fetch authenticated user
        <% if (options.user.enabled) { %>
        await dispatch('fetch')
        <% } %>
      },
  
      // Logout
      async logout ({ dispatch, state }, { endpoint = '<%= options.logout.endpoint %>' } = {}) {
        // Server side logout
        try {
          await this.$axios.$<%= options.logout.method.toLowerCase() %>(endpoint)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error while logging out', e)
        }
  
        // Reset store
        await dispatch('reset')
      }
    }
  }
  
  const getCanvasFp = function (options) {
    options = options ? options : {};
    var result = [];
    var canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 200;
    canvas.style.display = 'inline';
    var ctx = canvas.getContext('2d');

    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    result.push(
      'canvas winding:' +
      (ctx.isPointInPath(5, 5, 'evenodd') === false ? 'yes' : 'no')
    );
  
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';

    if (options.dontUseFakeFontInCanvas) {
      ctx.font = '11pt Arial';
    } else {
      ctx.font = '11pt no-real-font-123';
    }
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
    ctx.font = '18pt Arial';
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45);
  
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,255,0)';
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
  
    if (canvas.toDataURL) {
      result.push('canvas fp:' + canvas.toDataURL());
    }
    return result;
  };
  
  
  function getuuid() {
    let script = document.createElement('script');
    let fingerPrintHash = '';
    document.getElementsByTagName('head')[0].appendChild(script);
    let fingerPrintRawData = getCanvasFp()[1];
    fingerPrintHash = md5(fingerPrintRawData);
    console.log(fingerPrintHash);
    localStorage.setItem('fingerPrintHash', fingerPrintHash);
  }