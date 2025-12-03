import { PhysicsAggregate } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import { gui, setText } from "./gui";

// Collision callback function
const collideCB = (collision: {
  collider: { transformNode: { name: any } };
  collidedAgainst: { transformNode: { name: any } };
  point: any;
  distance: any;
  impulse: any;
  normal: any;
}): void => {
  console.log(
    "collideCB",
    collision.collider.transformNode.name,
    collision.collidedAgainst.transformNode.name
  );
};

const collideCB1 = (collision: {
  collider: { transformNode: { name: any } };
  collidedAgainst: { transformNode: { name: any } };
  point: any;
  distance: any;
  impulse: any;
  normal: any;
}): void => {
  console.log(
    "collideCB1",
    collision.collider.transformNode.name,
    collision.collidedAgainst.transformNode.name
  );
  setText(collision.collider.transformNode.name, 1);
  setText(collision.collidedAgainst.transformNode.name, 2);
  setText(collision.point.x.toFixed(2), 3);
  setText(collision.point.z.toFixed(2), 4);
};

export function setupCollisions(sceneData: SceneData): void {
  // Collision filter groups
  const FILTER_GROUP_GROUND = 1;
  const FILTER_GROUP_PLATFORM = 2;
  const FILTER_GROUP_CUBE = 3;
  const FILTER_GROUP_OBSTACLE = 4;
  const FILTER_GROUP_PLAYER = 5;

  // Apply masks and collisions to physics aggregates

  // === GROUND ===
  if (sceneData.ground?.physicsAggregate) {
    const agg = sceneData.ground.physicsAggregate;
    agg.shape.filterMembershipMask = FILTER_GROUP_GROUND;
    agg.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_GROUND;
    agg.body.getCollisionObservable().add(collideCB1);
  }

  // === BOX1 ===
  if (sceneData.box1) {
    const agg = sceneData.box1;
    agg.shape.filterMembershipMask = FILTER_GROUP_CUBE;
    agg.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_GROUND;
    agg.body.getCollisionObservable().add(collideCB);
  }

  // === BOX2 ===
  if (sceneData.box2) {
    const agg = sceneData.box2;
    agg.shape.filterMembershipMask = FILTER_GROUP_CUBE;
    agg.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_GROUND;
    agg.body.getCollisionObservable().add(collideCB);
  }

  // === BOX3 ===
  if (sceneData.box3) {
    const agg = sceneData.box3;
    agg.shape.filterMembershipMask = FILTER_GROUP_CUBE;
    agg.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_GROUND;
    agg.body.getCollisionObservable().add(collideCB);
  }

  // === BOX4 ===
  if (sceneData.box4) {
    const agg = sceneData.box4;
    agg.shape.filterMembershipMask = FILTER_GROUP_CUBE;
    agg.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_GROUND;
    agg.body.getCollisionObservable().add(collideCB);
  }
}
