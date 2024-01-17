import { FC, memo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';


//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as fabric from '@boardxus/x-canvas';
// import rehypeMathjax from 'rehype-mathjax';
//** Import i18n
import { useTranslation } from 'react-i18next';
import { CodeBlock } from './CodeBlock';
//** Import Redux kit
import store, { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatMsgInfoMutation } from 'redux/AiAssistApiSlice';
import { handleSetAiToolBar } from 'store/domArea';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';


//** Import MUI Icons
import MoreVertIcon from 'mui/icons/MoreVertIcon';
import ChatAIAgreeIcon from 'mui/icons/ChatAIAgreeIcon';
import ChatAIDisagreeIcon from 'mui/icons/ChatAIDisagreeIcon';
import server from 'startup/serverConnect';
import ChatItemVoice from './ChatItemVoice';

const MemoizedReactMarkdown = memo(
  ReactMarkdown,
  (prevProps, nextProps) => (
    prevProps.children === nextProps.children
  )
);
const PREFIX = 'ChatItemMarkdown';

const classes = {
  messageTextUser: `${PREFIX}-messageTextUser`,
  messageTextAI: `${PREFIX}-messageTextAI`,
  markdownStyle: `${PREFIX}-markdownStyle`,
};

const StyledBox = styled(Box)({
  [`& .${classes.messageTextUser}`]: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '25px',
    color: '#232930',
    padding: '10px',
    wordBreak: 'normal',
    height: 'auto',
    maxWidth: '90%',
    // whiteSpace: 'pre-wrap',
    background: '#FFFFFF',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
    borderRadius: '0px 4px 4px 4px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    '& p:first-of-type': {
      margin: 0
    },
    '& p': {
      margin: 0
    }
  },
  [`& .${classes.messageTextAI}`]: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '25px',
    color: '#232930',
    padding: '10px',
    wordBreak: 'normal',
    height: 'auto',
    // maxWidth: '90%',
    // whiteSpace: 'pre-wrap',
    background: '#D3F4F4',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
    borderRadius: '0px 4px 4px 4px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    '& p:first-of-type': {
      margin: 0
    },
    '& p': {
      margin: 0
    }
  },

  [`& .${classes.markdownStyle}`]: {
    '& ol': {
      margin: 15,
      paddingLeft: '20px',
      // '& li p': {
      //   marginTop: '-16px !important'
      // }
    }
  },

});


function ChatItemMarkdown({ item, index, dialogFullScreen, openMoreMenu, setOpenMoreMenu }) {
  return (
    <StyledBox sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <MemoizedReactMarkdown
        children={item.message}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (children.length) {
              if (children[0] == '▍') {
                return <span className="animate-pulse cursor-default mt-1">▍</span>
              }

              children[0] = (children[0] as string).replace("`▍`", "▍")
            }

            const match = /language-(\w+)/.exec(className || '');

            return !inline ? (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <table style={{ borderCollapse: 'collapse', border: '1px solid black', padding: '12px', borderColor: '#eeeeee' }}>
                {children}
              </table>
            );
          },

          th({ children }) {
            return (
              <th style={{ wordBreak: 'break-word', border: '1px solid black', backgroundColor: '#a0aec0', padding: '12px', color: 'white', borderColor: '#eeeeee' }}>
                {children}
              </th>
            );
          },

          td({ children }) {
            return (
              <td style={{ wordBreak: 'break-word', border: '1px solid black', padding: '12px', borderColor: '#eeeeee' }}>
                {children}
              </td>
            );
          }
        }}
        remarkPlugins={[remarkGfm, remarkMath]}
        className={clsx(
          item.type=='user'
            ? classes.messageTextUser
            : classes.messageTextAI,
          classes.markdownStyle
        )}
      />
      <IconButton
        id={`chatMessageMoreMenu${index}`}
        onClick={() => setOpenMoreMenu(!openMoreMenu)}
        sx={{
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          width: '24px',
          height: '38px',
          // backgroundColor: '#D3F4F4 !important',
          marginLeft: '6px',
          borderRadius: '4px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
          justifyContent: 'center'
        }}
      >
        <MoreVertIcon />
      </IconButton>
    </StyledBox>
  );
}

export default ChatItemMarkdown;