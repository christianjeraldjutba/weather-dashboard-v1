/**
 * SEO optimization utilities
 */

import { WeatherData } from '@/types/weather';

/**
 * Meta tag interface
 */
interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  key?: string;
}

/**
 * SEO manager class
 */
export class SEOManager {
  private static instance: SEOManager;
  private defaultTitle = 'WeatherDash Pro - Advanced Weather Dashboard';
  private defaultDescription = 'Professional weather dashboard with real-time forecasts, interactive charts, and advanced weather analytics. Get accurate weather information for any location worldwide.';
  private defaultKeywords = 'weather, forecast, dashboard, temperature, humidity, wind, precipitation, weather app, meteorology';

  private constructor() {}

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  /**
   * Set page title
   */
  setTitle(title: string, location?: string): void {
    const fullTitle = location 
      ? `${title} - ${location} | WeatherDash Pro`
      : `${title} | WeatherDash Pro`;
    
    document.title = fullTitle;
    this.setMetaTag({ property: 'og:title', content: fullTitle });
    this.setMetaTag({ name: 'twitter:title', content: fullTitle });
  }

  /**
   * Set page description
   */
  setDescription(description: string): void {
    this.setMetaTag({ name: 'description', content: description });
    this.setMetaTag({ property: 'og:description', content: description });
    this.setMetaTag({ name: 'twitter:description', content: description });
  }

  /**
   * Set keywords
   */
  setKeywords(keywords: string[]): void {
    const keywordString = keywords.join(', ');
    this.setMetaTag({ name: 'keywords', content: keywordString });
  }

  /**
   * Set canonical URL
   */
  setCanonicalUrl(url: string): void {
    this.setLinkTag('canonical', url);
    this.setMetaTag({ property: 'og:url', content: url });
  }

  /**
   * Set meta tag
   */
  private setMetaTag(tag: MetaTag): void {
    const key = tag.key || tag.name || tag.property || '';
    const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
    
    let element = document.querySelector(selector) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      if (tag.name) element.name = tag.name;
      if (tag.property) element.setAttribute('property', tag.property);
      document.head.appendChild(element);
    }
    
    element.content = tag.content;
  }

  /**
   * Set link tag
   */
  private setLinkTag(rel: string, href: string): void {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (!element) {
      element = document.createElement('link');
      element.rel = rel;
      document.head.appendChild(element);
    }
    
    element.href = href;
  }

  /**
   * Set weather-specific SEO data
   */
  setWeatherSEO(weatherData: WeatherData): void {
    const location = weatherData.location;
    const current = weatherData.current;
    
    // Title
    this.setTitle(
      `${Math.round(current.temperature)}°C ${current.description}`,
      `${location.name}, ${location.country}`
    );

    // Description
    const description = `Current weather in ${location.name}, ${location.country}: ${Math.round(current.temperature)}°C, ${current.description}. Humidity: ${current.humidity}%, Wind: ${current.windSpeed} km/h. Get detailed 7-day forecast and weather analytics.`;
    this.setDescription(description);

    // Keywords
    const weatherKeywords = [
      location.name.toLowerCase(),
      location.country.toLowerCase(),
      current.description.toLowerCase(),
      'current weather',
      'weather forecast',
      'temperature',
      'humidity',
      'wind speed',
    ];
    this.setKeywords([...weatherKeywords, ...this.defaultKeywords.split(', ')]);

    // Structured data
    this.setWeatherStructuredData(weatherData);
  }

  /**
   * Set structured data for weather
   */
  private setWeatherStructuredData(weatherData: WeatherData): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WeatherForecast',
      'name': `Weather forecast for ${weatherData.location.name}`,
      'description': `Current weather and 7-day forecast for ${weatherData.location.name}, ${weatherData.location.country}`,
      'location': {
        '@type': 'Place',
        'name': weatherData.location.name,
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': weatherData.location.lat,
          'longitude': weatherData.location.lon,
        },
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': weatherData.location.country,
        },
      },
      'datePublished': new Date().toISOString(),
      'dateModified': new Date(weatherData.lastUpdated).toISOString(),
      'author': {
        '@type': 'Organization',
        'name': 'WeatherDash Pro',
        'url': window.location.origin,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'WeatherDash Pro',
        'url': window.location.origin,
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/logo/cloudy.png`,
        },
      },
      'mainEntity': {
        '@type': 'WeatherObservation',
        'observationDate': new Date().toISOString(),
        'observationLocation': {
          '@type': 'Place',
          'name': weatherData.location.name,
        },
        'temperature': {
          '@type': 'QuantitativeValue',
          'value': weatherData.current.temperature,
          'unitCode': 'CEL',
        },
        'humidity': {
          '@type': 'QuantitativeValue',
          'value': weatherData.current.humidity,
          'unitCode': 'P1',
        },
        'windSpeed': {
          '@type': 'QuantitativeValue',
          'value': weatherData.current.windSpeed,
          'unitCode': 'KMH',
        },
        'atmosphericPressure': {
          '@type': 'QuantitativeValue',
          'value': weatherData.current.pressure,
          'unitCode': 'HPA',
        },
        'weatherCondition': weatherData.current.description,
      },
    };

    this.setStructuredData('weather-forecast', structuredData);
  }

  /**
   * Set structured data
   */
  private setStructuredData(id: string, data: any): void {
    let script = document.getElementById(`structured-data-${id}`) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = `structured-data-${id}`;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  }

  /**
   * Set default SEO tags
   */
  setDefaultSEO(): void {
    this.setTitle('Advanced Weather Dashboard');
    this.setDescription(this.defaultDescription);
    this.setKeywords(this.defaultKeywords.split(', '));
    this.setCanonicalUrl(window.location.href);

    // Open Graph tags
    this.setMetaTag({ property: 'og:type', content: 'website' });
    this.setMetaTag({ property: 'og:site_name', content: 'WeatherDash Pro' });
    this.setMetaTag({ property: 'og:image', content: `${window.location.origin}/logo/cloudy.png` });
    this.setMetaTag({ property: 'og:image:width', content: '512' });
    this.setMetaTag({ property: 'og:image:height', content: '512' });
    this.setMetaTag({ property: 'og:locale', content: 'en_US' });

    // Twitter Card tags
    this.setMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.setMetaTag({ name: 'twitter:site', content: '@WeatherDashPro' });
    this.setMetaTag({ name: 'twitter:creator', content: '@WeatherDashPro' });
    this.setMetaTag({ name: 'twitter:image', content: `${window.location.origin}/logo/cloudy.png` });

    // Additional meta tags
    this.setMetaTag({ name: 'robots', content: 'index, follow' });
    this.setMetaTag({ name: 'author', content: 'WeatherDash Pro' });
    this.setMetaTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' });
    this.setMetaTag({ name: 'theme-color', content: '#3b82f6' });
    this.setMetaTag({ name: 'msapplication-TileColor', content: '#3b82f6' });

    // App-specific meta tags
    this.setMetaTag({ name: 'application-name', content: 'WeatherDash Pro' });
    this.setMetaTag({ name: 'apple-mobile-web-app-title', content: 'WeatherDash Pro' });
    this.setMetaTag({ name: 'mobile-web-app-capable', content: 'yes' });
    this.setMetaTag({ name: 'apple-mobile-web-app-status-bar-style', content: 'default' });

    // Default structured data
    this.setDefaultStructuredData();
  }

  /**
   * Set default structured data
   */
  private setDefaultStructuredData(): void {
    const websiteData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'WeatherDash Pro',
      'description': this.defaultDescription,
      'url': window.location.origin,
      'applicationCategory': 'Weather',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'author': {
        '@type': 'Organization',
        'name': 'WeatherDash Pro',
        'url': window.location.origin,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'WeatherDash Pro',
        'url': window.location.origin,
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/logo/cloudy.png`,
        },
      },
      'featureList': [
        'Real-time weather data',
        '7-day weather forecast',
        'Interactive weather charts',
        'Weather alerts and notifications',
        'Favorite locations management',
        'Responsive design',
        'Offline support',
      ],
    };

    this.setStructuredData('website', websiteData);
  }

  /**
   * Generate sitemap data
   */
  generateSitemap(): string {
    const baseUrl = window.location.origin;
    const pages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/?view=forecast', priority: '0.8', changefreq: 'daily' },
      { url: '/?view=charts', priority: '0.7', changefreq: 'weekly' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    const baseUrl = window.location.origin;
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /*.json$

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
  }
}

/**
 * Global SEO manager instance
 */
export const seoManager = SEOManager.getInstance();

/**
 * Initialize SEO
 */
export const initializeSEO = (): void => {
  seoManager.setDefaultSEO();
};

/**
 * Update SEO for weather data
 */
export const updateWeatherSEO = (weatherData: WeatherData): void => {
  seoManager.setWeatherSEO(weatherData);
};
