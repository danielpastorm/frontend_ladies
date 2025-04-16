// ladiespresset.module.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const LadiesPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#FCE4EC',
      100: '#F8BBD0',
      200: '#F48FB1',
      300: '#F06292',
      400: '#EC407A',
      500: '#E91E63',
      600: '#D81B60',
      700: '#C2185B',
      800: '#AD1457',
      900: '#880E4F',
      950: '#560027'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#FFF5F7', // fondo rosita claro 🌸
          50: '#FFF0F5',
          100: '#FFE4EC',
          200: '#FFD6E7',
          300: '#FFC1CC',
          400: '#FFB6C1',
          500: '#FF8DAA',
          600: '#FF6E9A',
          700: '#FF4D89',
          800: '#E43A70',
          900: '#AD1457',
          950: '#880E4F'
        }
      },
      dark: {
        surface: {
          0: '#2A1A1F', // Fondo principal oscuro
          50: '#3D2B30',
          100: '#513D44',
          200: '#664F58',
          300: '#7A616C',
          400: '#8E7380',
          500: '#A28594',
          600: '#B697A8',
          700: '#CAA9BC',
          800: '#DECBD0',
          900: '#F2DDE4',
          950: '#FFF0F5' // Rosa clarito para detalles
        }
      }
      
    },
    components: {
      Body: {
        root: {
          background: '#FFF5F7' // fondo página rosita claro
        }
      },
      Button: {
        root: {
          borderRadius: '50px',
          padding: '0.75rem 1.5rem',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        },
        colorScheme: {
          light: {
            root: {
              background: '#EC407A',
              color: '#ffffff',
              borderColor: '#EC407A',
              boxShadow: '0 4px 6px rgba(236, 64, 122, 0.3)'
            },
            hover: {
              background: '#D81B60',
              color: '#ffffff',
              borderColor: '#D81B60',
              transform: 'scale(1.05)'
            },
            active: {
              background: '#AD1457',
              color: '#ffffff',
              borderColor: '#AD1457'
            }
          },
          dark: {
            root: {
              background: '#AD1457',
              color: '#ffffff',
              borderColor: '#AD1457'
            },
            hover: {
              background: '#880E4F',
              color: '#ffffff',
              borderColor: '#880E4F'
            },
            active: {
              background: '#560027',
              color: '#ffffff',
              borderColor: '#560027'
            }
          }
        }
      },
      Card: {
        root: {
          borderRadius: '15px',
          background: 'rgba(255, 240, 245, 0.6)', // glassmorphism
          backdropFilter: 'blur(10px)',
          color: '#AD1457',
          boxShadow: '0 8px 16px rgba(236, 64, 122, 0.2)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        hover: {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 24px rgba(236, 64, 122, 0.3)'
        }
      },
      InputText: {
        root: {
          borderRadius: '10px',
          borderColor: '#EC407A',
          boxShadow: '0 2px 4px rgba(236, 64, 122, 0.1)',
          transition: 'all 0.3s ease'
        },
        hover: {
          borderColor: '#D81B60'
        }
      },
      Dropdown: {
        root: {
          borderRadius: '10px',
          borderColor: '#EC407A',
          boxShadow: '0 2px 4px rgba(236, 64, 122, 0.1)',
          transition: 'all 0.3s ease'
        },
        hover: {
          borderColor: '#D81B60'
        }
      },
      Dialog: {
        root: {
          borderRadius: '15px',
          background: 'rgba(255, 240, 245, 0.7)', // glassmorphism
          backdropFilter: 'blur(12px)',
          color: '#880E4F',
          boxShadow: '0 12px 24px rgba(236, 64, 122, 0.3)'
        }
      }
    }
  }
});