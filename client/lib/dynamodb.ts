"use server";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";

import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
export const createUserAvatar = async (userId: string, avatarUrl: string) => {
  const Item = {
    userID: { S: userId },
    avatarUrl: { S: avatarUrl },
  };
  try {
    const res = await client.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_USER_AVATARS_TABLE_NAME,
        ConditionExpression: "attribute_not_exists(userID)",
        Item,
      })
    );

    return res;
  } catch (error) {
    // user exists
    console.log("User exists");
  }
};

export const getUserAvatar = async (userId: string) => {
  const { Item } = await client.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_USER_AVATARS_TABLE_NAME!,
      Key: {
        userID: { S: userId },
      },
    })
  );

  return Item ? unmarshall(Item) : null;
};
