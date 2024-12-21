'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; // Adjust the import path accordingly
import { Image, Space } from 'antd';
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';

const Gallery: React.FC = () => {
  const imageList = useSelector((state: RootState) => state.imageList.images); // Accessing the imageList state
  const [current, setCurrent] = React.useState(0);

  const onDownload = () => {
    const url = imageList[current].url;
    const suffix = url.slice(url.lastIndexOf('.'));
    const filename = Date.now() + suffix;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        {imageList.map((item, index) => (
          <Image key={index} src={item.url} alt={item.description} />
        ))}
      </div>

      <Image.PreviewGroup
        preview={{
          toolbarRender: (
            _,
            {
              transform: { scale },
              actions: { onActive, onRotateLeft, onRotateRight, onZoomOut, onZoomIn, onReset },
            }
          ) => (
            <Space size={12} className="toolbar-wrapper flex space-x-4">
              <LeftOutlined onClick={() => onActive?.(-1)} className="cursor-pointer hover:text-blue-500" />
              <RightOutlined onClick={() => onActive?.(1)} className="cursor-pointer hover:text-blue-500" />
              <DownloadOutlined onClick={onDownload} className="cursor-pointer hover:text-blue-500" />
              <RotateLeftOutlined onClick={onRotateLeft} className="cursor-pointer hover:text-blue-500" />
              <RotateRightOutlined onClick={onRotateRight} className="cursor-pointer hover:text-blue-500" />
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} className="cursor-pointer hover:text-blue-500" />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} className="cursor-pointer hover:text-blue-500" />
              <UndoOutlined onClick={onReset} className="cursor-pointer hover:text-blue-500" />
            </Space>
          ),
          onChange: (index) => {
            setCurrent(index);
          },
        }}
      />
    </div>
  );
};

export default Gallery;
