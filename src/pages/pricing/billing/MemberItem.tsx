import React, { useEffect } from 'react';

import { useState } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import { Checkbox } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'

const MemberItem = (props: any) => {
  const { member, selectMemberIds, setSelectMemberIds } = props
  const [isSelected, setIsSelected] = useState<boolean>(selectMemberIds.includes(member.userId))

  const handleChange = () => {
    setIsSelected(!isSelected);
    isSelected ? setSelectMemberIds(selectMemberIds.filter((item: string) => item !== member.userId)) : setSelectMemberIds([...selectMemberIds, member.userId])
  }

  useEffect(() => {
    if (selectMemberIds.length > 0) {
      setIsSelected(selectMemberIds.includes(member.userId))
    }

  }, []);
  return (
    <ListItem sx={{ px: 0, py: 2, display: 'flex', flexWrap: 'wrap' }}>
      <ListItemAvatar>
        <Avatar src={`/images/avatars/${member.avatar}`} alt={member.username} />
      </ListItemAvatar>
      <ListItemText sx={{ m: 0 }} primary={member.username} secondary={member.user[0].emails[0].address} />
      <ListItemSecondaryAction sx={{ right: 0 }}>
        <Checkbox checked={isSelected} onChange={handleChange} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default MemberItem;