import { CSSProperties } from 'react';
import { Col, Image } from 'antd';

interface ImageProps {
  url: string;
  description: string;
}

const ImageCard: React.FC<ImageProps> = ({ url, description }) => {
  const imageContainerStyle: CSSProperties = {
    position: 'relative',
  };

  const descriptionStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    opacity: 0,
  };

  const hoverStyle: CSSProperties = {
    opacity: 1,
  };

  return (
    <Col >
      <div style={imageContainerStyle}>
        <Image alt={description} src={url} width="100%" />
        {/* <div style={{ ...descriptionStyle, ...hoverStyle }}>
          {description}
        </div> */}
      </div>
    </Col>
  );
};

export default ImageCard;
