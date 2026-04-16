// 🕊️白木 原创开发 🔗gl.baimu.live
// 🔄 Service Worker - 离线缓存和资源优化

const CACHE_NAME = 'rouxzhee-cache-v1';
const STATIC_CACHE_NAME = 'rouxzhee-static-v1';
const DYNAMIC_CACHE_NAME = 'rouxzhee-dynamic-v1';

// 📦 需要预缓存的静态资源
const PRECACHE_URLS = [
  '/',
  '/favicon.svg',
  '/fonts/ZiHun232Hao.woff2',
  '/fonts/筑紫A丸.woff2',
];

// ⏰ 缓存过期时间（毫秒）
const CACHE_EXPIRY = {
  static: 30 * 24 * 60 * 60 * 1000, // 静态资源：30 天
  dynamic: 24 * 60 * 60 * 1000, // 动态资源：1 天
  images: 7 * 24 * 60 * 60 * 1000, // 图片：7 天
};

// 🚀 安装事件 - 预缓存关键资源
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker 安装中...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('📦 预缓存静态资源');
      return cache.addAll(PRECACHE_URLS);
    })
  );

  // ⚡ 立即激活，不等待旧 Service Worker 关闭
  self.skipWaiting();
});

// 🔄 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker 激活中...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== STATIC_CACHE_NAME &&
              name !== DYNAMIC_CACHE_NAME &&
              name.startsWith('rouxzhee-')
            );
          })
          .map((name) => {
            console.log(`🗑️ 删除旧缓存: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );

  // 立即控制所有客户端
  self.clients.claim();
});

// 🌐 拦截网络请求 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 🔒 只处理 GET 请求和同源请求
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // 🖼️ 图片请求：Cache First + 网络更新
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // 🎨 字体和样式文件：Cache First
  if (
    request.destination === 'font' ||
    request.destination === 'style'
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }

  // 📝 JavaScript 文件：Stale While Revalidate
  if (request.destination === 'script') {
    event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE_NAME));
    return;
  }

  // 📄 HTML 页面：Network First + 缓存后备
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // 其他请求：Network First
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
});

/**
 * 🥇 Cache First 策略 - 优先使用缓存
 */
async function cacheFirstStrategy(
  request: Request,
  cacheName: string
): Promise<Response> {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // 后台静默更新缓存
    updateCacheInBackground(request, cacheName);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('❌ 网络请求失败:', error);
    return new Response('离线模式', { status: 503 });
  }
}

/**
 * 🌐 Network First 策略 - 优先使用网络
 */
async function networkFirstStrategy(
  request: Request,
  cacheName: string
): Promise<Response> {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('📦 使用缓存响应:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('离线模式', { status: 503 });
  }
}

/**
 * 🔄 Stale While Revalidate 策略 - 先返回缓存，后台更新
 */
async function staleWhileRevalidateStrategy(
  request: Request,
  cacheName: string
): Promise<Response> {
  const cachedResponse = await caches.match(request);

  // 后台获取最新数据并更新缓存
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, networkResponse.clone());
        });
      }
      return networkResponse;
    })
    .catch(() => {
      console.warn('⚠️ 后台更新失败:', request.url);
    });

  return cachedResponse || fetchPromise;
}

/**
 * 🔄 后台更新缓存
 */
async function updateCacheInBackground(
  request: Request,
  cacheName: string
): Promise<void> {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response);
    }
  } catch (error) {
    // 静默失败，不影响用户体验
    console.debug('🔄 后台更新失败:', error);
  }
}
