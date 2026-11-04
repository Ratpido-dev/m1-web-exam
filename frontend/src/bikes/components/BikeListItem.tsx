import {
  EyeOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Col, Row, Space, Tag } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import { formatPrice } from "../../shared/utils/formatPrice";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  return (
    <ListItem>
      <Col span={9}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <TagOutlined />
          {`${bike.brand} ${bike.model}`}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={5}>
        <Tag>{bike.category}</Tag>
      </Col>
      <Col span={5}>{bike.frameMaterial}</Col>
      <Col span={3} style={{ textAlign: "right", fontWeight: "bold" }}>
        {formatPrice(bike.priceCents)}
      </Col>
      <Col span={2}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            <ButtonLink to="/bikes/$bikeId" params={{ bikeId: bike.id }}>
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton bike={bike} deleteBike={deleteBike} />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};
