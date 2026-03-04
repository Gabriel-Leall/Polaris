# Primary Color

/* tailwind.config.js v4 generated from Kigen.design */
/* Add to your CSS file */
:root {
  --anakiwa-50: 0.954 0.027 226.8;
  --anakiwa-100: 0.918 0.052 224.7;
  --anakiwa-200: 0.858 0.095 221.7;
  --anakiwa-300: 0.795 0.135 218.6;
  --anakiwa-400: 0.713 0.121 218.4;
  --anakiwa-500: 0.621 0.105 218.6;
  --anakiwa-600: 0.518 0.088 219.3;
  --anakiwa-700: 0.410 0.070 219.0;
  --anakiwa-800: 0.298 0.050 218.4;
  --anakiwa-900: 0.173 0.030 219.9;
}
        
/* tailwind.config.js */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {
          colors: {
            'anakiwa': {
                50: 'oklch(var(--anakiwa-50) / <alpha-value>)',
                100: 'oklch(var(--anakiwa-100) / <alpha-value>)',
                200: 'oklch(var(--anakiwa-200) / <alpha-value>)',
                300: 'oklch(var(--anakiwa-300) / <alpha-value>)',
                400: 'oklch(var(--anakiwa-400) / <alpha-value>)',
                500: 'oklch(var(--anakiwa-500) / <alpha-value>)',
                600: 'oklch(var(--anakiwa-600) / <alpha-value>)',
                700: 'oklch(var(--anakiwa-700) / <alpha-value>)',
                800: 'oklch(var(--anakiwa-800) / <alpha-value>)',
                900: 'oklch(var(--anakiwa-900) / <alpha-value>)',
            }
          }
        }
      },
  plugins: [],
};

# Neutral Color
/* tailwind.config.js v4 generated from Kigen.design */
/* Add to your CSS file */
:root {
  --oslo-gray-50: 0.956 0.002 325.6;
  --oslo-gray-100: 0.896 0.004 301.4;
  --oslo-gray-200: 0.803 0.006 286.3;
  --oslo-gray-300: 0.718 0.010 292.7;
  --oslo-gray-400: 0.640 0.012 291.8;
  --oslo-gray-500: 0.580 0.014 291.1;
  --oslo-gray-600: 0.494 0.016 295.0;
  --oslo-gray-700: 0.398 0.013 291.5;
  --oslo-gray-800: 0.293 0.011 293.4;
  --oslo-gray-900: 0.179 0.006 285.8;
}
        
/* tailwind.config.js */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {
          colors: {
            'oslo-gray': {
                50: 'oklch(var(--oslo-gray-50) / <alpha-value>)',
                100: 'oklch(var(--oslo-gray-100) / <alpha-value>)',
                200: 'oklch(var(--oslo-gray-200) / <alpha-value>)',
                300: 'oklch(var(--oslo-gray-300) / <alpha-value>)',
                400: 'oklch(var(--oslo-gray-400) / <alpha-value>)',
                500: 'oklch(var(--oslo-gray-500) / <alpha-value>)',
                600: 'oklch(var(--oslo-gray-600) / <alpha-value>)',
                700: 'oklch(var(--oslo-gray-700) / <alpha-value>)',
                800: 'oklch(var(--oslo-gray-800) / <alpha-value>)',
                900: 'oklch(var(--oslo-gray-900) / <alpha-value>)',
            }
          }
        }
      },
  plugins: [],
};

---

# 🏆 Achievement Tier Colors

Paletas OKLCH exclusivas para cada tier de raridade do sistema de achievements.
Cada família de cor foi projetada para dark mode com tons otimizados para glows, bordas, badges e gradientes de ícone.

## Common — Iron Steel (Cinza Aço Frio)

```css
:root {
  --iron-50: 0.950 0.005 260.0;
  --iron-100: 0.880 0.008 260.0;
  --iron-200: 0.780 0.012 265.0;
  --iron-300: 0.680 0.014 268.0;
  --iron-400: 0.580 0.016 270.0;
  --iron-500: 0.500 0.014 272.0;
  --iron-600: 0.420 0.012 274.0;
  --iron-700: 0.340 0.010 275.0;
  --iron-800: 0.260 0.008 276.0;
  --iron-900: 0.180 0.006 278.0;
}
```

## Uncommon — Jade Circuit (Verde Circuito)

```css
:root {
  --jade-50: 0.960 0.030 160.0;
  --jade-100: 0.910 0.060 158.0;
  --jade-200: 0.840 0.095 155.0;
  --jade-300: 0.760 0.120 152.0;
  --jade-400: 0.680 0.110 150.0;
  --jade-500: 0.590 0.100 148.0;
  --jade-600: 0.500 0.085 146.0;
  --jade-700: 0.400 0.070 145.0;
  --jade-800: 0.300 0.050 144.0;
  --jade-900: 0.200 0.035 143.0;
}
```

## Rare — Cobalt Flux (Azul Cobalto Elétrico)

```css
:root {
  --cobalt-50: 0.955 0.030 250.0;
  --cobalt-100: 0.910 0.060 248.0;
  --cobalt-200: 0.840 0.105 245.0;
  --cobalt-300: 0.760 0.140 242.0;
  --cobalt-400: 0.670 0.130 240.0;
  --cobalt-500: 0.580 0.115 238.0;
  --cobalt-600: 0.490 0.100 236.0;
  --cobalt-700: 0.390 0.080 235.0;
  --cobalt-800: 0.290 0.060 234.0;
  --cobalt-900: 0.185 0.040 233.0;
}
```

## Epic — Void Amethyst (Roxo Dimensional)

```css
:root {
  --void-50: 0.955 0.030 300.0;
  --void-100: 0.900 0.065 298.0;
  --void-200: 0.830 0.110 295.0;
  --void-300: 0.750 0.150 292.0;
  --void-400: 0.660 0.140 290.0;
  --void-500: 0.570 0.125 288.0;
  --void-600: 0.480 0.110 286.0;
  --void-700: 0.380 0.090 285.0;
  --void-800: 0.280 0.065 284.0;
  --void-900: 0.180 0.045 283.0;
}
```

## Legendary — Solar Flare (Dourado Solar)

```css
:root {
  --solar-50: 0.965 0.030 85.0;
  --solar-100: 0.930 0.070 80.0;
  --solar-200: 0.880 0.130 75.0;
  --solar-300: 0.820 0.160 70.0;
  --solar-400: 0.760 0.155 65.0;
  --solar-500: 0.700 0.145 60.0;
  --solar-600: 0.620 0.130 55.0;
  --solar-700: 0.520 0.110 50.0;
  --solar-800: 0.400 0.085 48.0;
  --solar-900: 0.280 0.060 45.0;
}
```