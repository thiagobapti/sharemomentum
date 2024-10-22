"use client";
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
} from "@chakra-ui/react";
import logoMinSvg from "../sharemomentum-logo-min.svg";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import UnsplashDialog from "../components/unsplash-dialog";
import Image from "next/image";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [externalLink, setExternalLink] = useState("");
  const [selectedLayout, setSelectedLayout] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(true);
  const [isBackgroundDialogOpen, setIsBackgroundDialogOpen] = useState(false);
  const [campaign, setCampaign] = useState({
    programId: "",
    name: "",
    subtitle: "",
    background: "",
  });
  const [programs, setPrograms] = useState([]);
  const handleDownload = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        width: 600, // Set the desired width
        height: 400, // Set the desired height
      }).then(function (canvas) {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "screenshot.png";
        link.click();
      });
    }
  };

  const onClose = () => {
    setIsAlertDialogOpen(false);
  };

  const handleImageSelect = (imageUrl: string) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      background: imageUrl,
    }));
    setIsBackgroundDialogOpen(false);
  };

  const handleImageDelete = () => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      background: "",
    }));
  };

  const handleBackgroundModalDismiss = () => {
    setIsBackgroundDialogOpen(false);
  };

  useEffect(() => {
    fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "query { programs { id name } }",
      }),
    })
      .then((response) => response.json())
      .then((data) => setPrograms(data.data.programs))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleGenerate = useCallback(() => {
    if (campaign.programId) {
      fetch(`/api/generate?programId=${campaign.programId}`)
        .then((response) => response.json())
        .then((data: any) => {
          console.log(data);
          setCampaign((prevCampaign) => ({
            ...prevCampaign,
            name: data.phrase1,
            subtitle: data.phrase2,
          }));
        })
        .catch((error) => console.error("Error generating content:", error));
    }

    onClose();
  }, [campaign.programId]);

  return (
    <>
      <Flex>
        <Flex width={250} bg={"#f0f0f0"} height={"100vh"} direction={"column"}>
          <FormControl>
            <FormLabel>Program:</FormLabel>
            <select
              onChange={(e) =>
                setCampaign((prevCampaign) => ({
                  ...prevCampaign,
                  programId: e.target.value,
                }))
              }
              value={campaign.programId}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              <option value="">Select an option</option>
              {programs.map((program: any) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </FormControl>
          {/* <FormControl>
            <FormLabel>Layout:</FormLabel>
            <select
              onChange={(e) => setSelectedLayout(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              <option value="">Select an option</option>
              <option value="1">Text</option>
              <option value="2">+ Icon</option>
              <option value="3">+ Text</option>
            </select>
          </FormControl> */}
          <FormControl>
            <FormLabel>Title:</FormLabel>
            <input
              type="text"
              value={campaign.name}
              onChange={(e) =>
                setCampaign((prevCampaign) => ({
                  ...prevCampaign,
                  name: e.target.value,
                }))
              }
            />
            {/* <FormHelperText>Pick </FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Subtitle:</FormLabel>
            <input
              type="text"
              value={campaign.subtitle}
              onChange={(e) =>
                setCampaign((prevCampaign) => ({
                  ...prevCampaign,
                  subtitle: e.target.value,
                }))
              }
            />
            {/* <FormHelperText>Pick </FormHelperText> */}
          </FormControl>
          <Box p={4}>
            {campaign.background && (
              <>
                <Image
                  src={campaign.background}
                  alt="background"
                  width={300}
                  height={300}
                />
                <Button onClick={handleImageDelete}>Delete Background</Button>
              </>
            )}
            <Button onClick={() => setIsBackgroundDialogOpen(true)}>
              Select Background
            </Button>
          </Box>
        </Flex>
        <Flex flex={1} direction={"column"} alignItems={"center"}>
          <Flex
            direction={"row"}
            marginTop={"10px"}
            marginBottom={"50px"}
            align={"flex-start"}
            width={"100%"}
            padding={"0 20px"}
          >
            <Image src={logoMinSvg} alt="logo" width={48} height={48} />
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "14px",
                marginLeft: "10px",
                background:
                  "linear-gradient(45deg, rgb(141 45 255), rgb(0 0 0))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              share Momentum
            </Text>
          </Flex>
          <div
            ref={canvasRef}
            style={{
              backgroundImage: `url(${campaign.background})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "500px",
              width: "300px",
              position: "relative",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#590e0e",
                height: "100%",
                width: "100%",
                opacity: 0.8,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            ></div>
            <div
              style={{
                position: "relative",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
              }}
            >
              {campaign.name}
            </div>
            <div
              style={{
                position: "relative",
                fontSize: "18px",
                textAlign: "center",
                color: "white",
              }}
            >
              {campaign.subtitle}
            </div>
          </div>
        </Flex>
        <Flex width={250} bg={"#f0f0f0"} height={"100vh"} alignItems={"start"}>
          <button onClick={handleDownload}>Download</button>
          <label>
            <textarea defaultValue={externalLink}></textarea>
          </label>
        </Flex>
      </Flex>
      <AlertDialog
        isOpen={isAlertDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Welcome!
            </AlertDialogHeader>

            <AlertDialogBody>
              Select a campaign to continue
              <select
                onChange={(e) =>
                  setCampaign((prevCampaign) => ({
                    ...prevCampaign,
                    programId: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select an option</option>
                {programs.map((program: any) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleGenerate} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {isBackgroundDialogOpen && (
        <UnsplashDialog
          isOpen={isBackgroundDialogOpen}
          onClose={handleBackgroundModalDismiss}
          onSelect={handleImageSelect}
        />
      )}
    </>
  );
}
