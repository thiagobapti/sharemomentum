"use client";
import styles from "./page.module.css";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  AlertDialogBody,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Text,
  List,
  ListItem,
} from "@chakra-ui/react";
import logoMinSvg from "./sharemomentum-logo-min.svg";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import UnsplashDialog from "./components/unsplash-dialog";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <Flex alignItems={"center"} justifyContent={"center"} height={"100vh"}>
      <Flex direction={"column"}>
        <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
          {/* <motion.div
            initial={{ x: -40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
          > */}
          <Image src={logoMinSvg} alt="logo" width={82} height={82} />
          {/* </motion.div> */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 300,
            }}
          >
            <Text
              fontSize="28px"
              fontWeight="bold"
              mt="14px"
              ml="10px"
              bgGradient="linear(45deg, rgb(141 45 255), rgb(0 0 0))"
              bgClip="text"
              color="transparent"
              userSelect="none"
            >
              share Momentum
            </Text>
          </motion.div>
        </Flex>
        <Flex direction={"column"} alignItems={"center"}>
          <Text align={"center"} marginTop={"14px"} color={"gray.600"}>
            Easily create AI-enhanced shareable campaigns to <br />
            engage donors and partners for your cause!
          </Text>
          <List
            display="flex"
            flexDirection="column"
            justifyContent="center"
            margin="40px 0"
          >
            {[
              "AI-Powered Campaign Creation",
              "Shareable Formats",
              "Customization Options",
            ].map((_, index) => (
              <ListItem
                key={index}
                margin="0 4px"
                display="flex"
                alignItems="center"
                color={"gray.600"}
              >
                <Box
                  width="7px"
                  height="7px"
                  borderRadius="50%"
                  backgroundColor="#8D2DFF"
                  marginRight="7px"
                ></Box>
                {_}
              </ListItem>
            ))}
          </List>
          <Link href={"/edit"}>
            <Button marginTop={"10px"} colorScheme="purple">
              Create Campaign
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
