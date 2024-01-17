/* eslint-disable no-dupe-keys */
import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  direction: 'ltr',
  mixins: {
    toolbar: {
      minHeight: 56,
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 48
      }
    }
  },
  overrides: {},
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    type: 'light',
    primary: {
      50: '#F6649A',
      100: '#F6649A',
      200: '#F6649A',
      300: '#F6649A',
      400: '#F6649A',
      500: '#F21C6B',
      600: '#CA1762',
      700: '#CA1762',
      800: '#CA1762',
      900: '#CA1762',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff',
      main: '#F21D6B',
      light: '#0050C3',
      dark: '#F21D6B',
      contrastText: '#FFFFFF',

      // default
      default: '#F21D6B',
      hover: '#0050C3',
      inactive: 'rgba(0, 0, 0, 0.32)',
      textDefault: '#F21D6B'

      // new primary color
      // text: '#232930',
    },
    secondary: {
      main: '#F21D6B',
      light: '#0050C3',
      dark: '#F21D6B',
      contrastText: '#FFFFFF',
      // new secondary color
      text: '#A623293',
      // new secondary color
      blue: '#7B61FF'
    },
    background: {
      default: '#f2f2f3'
    },

    text: {
      primary: '#232930',
      secondary: 'rgba(35,41,48,0.65)',
      disabled: 'rgba(0,0,0,0.32)',
      hint: 'rgba(0,0,0,0.48)'
    },
    error: {
      light: '#fd3426',
      main: '#fd3426',
      dark: '#fd3426',
      contrastText: '#fff',

      // new light
      light1: '#FF0000'
    },
    // new model
    hint: {
      light: '#7A000000'
    },
    // new model
    border: {
      light: '#29000000'
    },
    // new model
    background: {
      light: '#F2F2F3'
    },
    // new model
    elementBackground: {
      light: '#FFFFFF'
    },
    // new model
    icon: {
      light: '#757575'
    },
    // new model
    selected: {
      light: '#D3F4F4'
    },

    // new buttons
    button: {
      // medium
      mediumWidth: 99,
      mediumHeight: 48,
      mediumPadding: '12px 24px 12px 24px',
      mediumRadius: 4,

      // small
      smallWidth: 99,
      smallHeight: 36,
      smallPadding: '6px 24px 6px 24px',
      smallRadius: 4,

      // large
      largeWidth: 320,
      largeHeight: 48,
      largePadding: '12px 24px 12px 24px',
      largeRadius: 4
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: '#232930',
      secondary: 'rgba(35, 41, 48, 0.65)',
      disabled: 'rgba(0, 0, 0, 0.32)',
      hint: 'rgba(0, 0, 0, 0.48)'
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      paper: '#fff',
      default: '#fff'
    },
    action: {
      active: '#D3F4F4',
      hover: '#F2F2F3',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.14)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)'
    }
  },
  props: {},
  shadows: [
    'none',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    '0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014,0px 1px 3px 2px #00000014)',
    // '0px 1px 3px 2px rgba(222, 222, 222, 0.64)' // new box shadow
  ],
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    display: {
      fontSize: '7rem',
      fontWeight: 300,
      fontFamily: 'Inter, sans-serif',
      letterSpacing: '-.04em',
      lineHeight: '1.14286em',
      marginLeft: '-.04em',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    display3: {
      fontSize: '3.5rem',
      fontWeight: 400,
      fontFamily: 'Inter, sans-serif',
      letterSpacing: '-.02em',
      lineHeight: '1.30357em',
      marginLeft: '-.02em',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    display2: {
      fontSize: '2.8125rem',
      fontWeight: 400,
      fontFamily: 'Inter, sans-serif',
      lineHeight: '1.13333em',
      marginLeft: '-.02em',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    display1: {
      fontSize: '2.125rem',
      fontWeight: 400,
      fontFamily: 'Inter, sans-serif',
      lineHeight: '1.20588em',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    headline: {
      fontSize: '2.25rem',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      lineHeight: '139%',
      color: '#232930'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      lineHeight: '150%',
      color: '#232930'
    },
    subheading: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      lineHeight: '150%',
      color: '#232930'
    },
    body2: {
      color: '#232930',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em'
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '150%'
    },
    caption: {
      color: 'rgba(35, 41, 48, 0.65)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '143%'
    },
    caption2: {
      color: 'rgba(35, 41, 48, 0.65)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: '133%'
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: '150%'
    },

    // new H1
    newh1: {
      color: '#232930',
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 36,
      lineHeight: 50
    },
    // new H2
    newh2: {
      color: '#232930',
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 28,
      lineHeight: 44
    },

    // new H3
    newh3: {
      color: '#232930',
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 20,
      lineHeight: 30
    },

    // new H6
    newh6: {
      color: '#232930',
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px'
    },

    // new body1
    newbody1: {
      fontFamily: 'sans-serif',
      fontWeight: 400,
      fontStyle: 'normal',
      color: '#232930',
      fontSize: 16,
      lineHeight: 24
    },

    // new body2
    newbody2: {
      fontFamily: 'sans-serif',
      fontWeight: 400,
      fontStyle: 'normal',
      color: '#333333',
      fontSize: 14,
      lineHeight: 20
    },

    h1: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '2.25rem',
      lineHeight: 1.39,
      letterSpacing: '-0.01562em'
    },
    h2: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.21,
      letterSpacing: '-0.00833em'
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: '#232930',
      letterSpacing: '0em'
    },
    h4: {
      color: '#232930',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      lineHeight: 1.5,
      fontSize: '2rem'
    },
    h5: {
      color: '#232930',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    h6: {
      color: '#232930',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5
    },

    subtitle: {
      // new subtitle2
      newsubtitle2: {
        fontFamily: 'sans-serif',
        fontWeight: 500,
        fontStyle: 'normal',
        color: '#232930',
        fontSize: 14,
        lineHeight: 20
      },
      // new caption1
      newcaption1: {
        fontFamily: 'sans-serif',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#A6232930',
        fontSize: 14,
        lineHeight: 20
      },
      // new caption2
      newcaption2: {
        fontFamily: 'sans-serif',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#A6232930',
        fontSize: 12,
        lineHeight: 16
      },
      button: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        color: '#232930',
        fontSize: '1rem'
      },
      subtitle2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        color: '#232930',
        fontSize: '0.875rem'
      },

      caption1: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        color: 'rgba(35, 41, 48, 0.65)'
      },

      caption2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        color: 'rgba(35, 41, 48, 0.65)'
      },
      overline: {
        color: 'rgba(35, 41, 48, 0.65)',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: '133%'
      },
      useNextVariants: true
    }
  },
  shape: {
    borderRadius: 4,

    // border
    newborder: '1px solid #7b61ff',
    // disable border
    disborder: '1px solid rgba(0, 0, 0, 0.32)'
  },
  spacing: 8,
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  nprogress: {
    color: '#000'
  },

  // new input text field
  // new input textfield
  inputField: {
    small: {
      width: 113,
      height: 24
    }
  }
});

// comppose the global override
theme = createTheme(theme, {
  components: {
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple!
      },
    },
  },
});

// comppose the component Button
theme = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // backgroundColor: '#f21d6b',
          borderRadius: 4,
          textTransform: 'capitalize',
          width: 'auto',
          border: 0,
          color: '#FFFFFF',
          height: 36,
          // padding: '0 30px',
          boxShadow: 'none',
          '&.Mui-disabled': {
            border: '0px',
            color: theme.palette.primary.inactive,
          },
          '&:hover': {
            background: '#F21D6B',
            boxShadow: 'none',
          },
        },
        textPrimary: {
          background: '#ffffff',
          color: theme.palette.primary.default,

          display: 'flex',

          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',

          boxSizing: 'border-box',
          '&.Mui-disabled': {
            color: theme.palette.primary.inactive,
          },
          '&:hover': {
            color: '#F21D6B',
            background: '#FFF',
          },
        },
      },

      defaultProps: {
        size: 'small',
      },
    },
  },
});

// AvatarGroup
theme = createTheme(theme, {
  components: {
    MuiAvatarGroup: {
      styleOverrides: {
        root: {},
        avatar: {
          fontSize: 12,
          width: '24px',
          height: '24px',
          sizes: '24px',
        },
      },
    },
  },
});

// MuiSvgIcon
theme = createTheme(theme, {
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: '24px',
          height: '24px',
        },
      },
    },
  },
});

// AppBar
theme = createTheme(theme, {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // minHeight: 50,
        },
      },
    },
  },
});

// Dialog
theme = createTheme(theme, {
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 1px 3px 2px #00000014',
          borderRadius: '8px',
        },
      },
    },
  },
});

// IconButton
theme = createTheme(theme, {
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'rgba(0,0,0,0.54)',
          width: '44px',
          height: '44px',
          textAlign: 'center',
          // lineHeight: '40px',
          borderRadius: 0,
          '&:hover': {
            color: '#0050C3',
            background: 'rgba(0,0,0,0)',
          },
        },
      },
    },
  },
});

// Link
theme = createTheme(theme, {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            // color: 'rgba(0, 0, 0, 0.32)',
            color: '#F21D6B',
          },
          '&:hover': {
            // color: '#F21D6B',
            background: '#FFF',
          },
        },
      },
    },
  },
});

// Paper

theme = createTheme(theme, {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

// Popover
theme = createTheme(theme, {
  components: {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 1px 3px 2px #00000014',
          borderRadius: '8px',
          overflow: 'hidden',
        },
      },
    },
  },
});

// Popper
theme = createTheme(theme, {
  components: {
    MuiPopper: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 1px 3px 2px #00000014',
          borderRadius: '4px',
          background: 'white',
          zIndex: 0,
        },
      },
    },
  },
});

// Textfield
theme = createTheme(theme, {
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          color: theme.palette.secondary.main,
          margin: 'dense',
          '&:focus': {
            color: theme.palette.secondary.main,
          },
        },
      },
      defaultProps: {
        color: 'secondary',
      },
    },
  },
});

// TottleButton
theme = createTheme(theme, {
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 0,
          '&:hover': {
            color: '#F21D6B',
            // opacity: 1,
            background: 'rgba(0,0,0,0)',
          },
          '&.Mui-selected': {
            color: '#F21D6B',
            // opacity: 1,
            background: 'rgba(0,0,0,0)',
          },
          '&.Mui-selected:hover': {
            // opacity: 1,
            background: 'rgba(0,0,0,0)',
          },
        },
      },
    },
  },
});

//CardMedia
// theme = createTheme(theme, {
//   components: {
//     MuiCardMedia: {
//       styleOverrides: {
//         root: {
//           backgroundColor: '#F21D6B',
//         }
//       }
//     }
//   }
// })

/*
theme = createTheme(theme, {
  components:{
    XXXXModule:{
      styleOverrides:{

      }
    }
  }
});
*/
export default theme;
