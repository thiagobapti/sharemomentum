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
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
} from "@chakra-ui/react";
import logoMinSvg from "../sharemomentum-logo-min.svg";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import UnsplashDialog from "../components/unsplash-dialog";
import Image from "next/image";
import { themes as themesData } from "../data/database";
import { BsStars } from "react-icons/bs";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [externalLink, setExternalLink] = useState("");
  const [selectedLayout, setSelectedLayout] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(true);
  const [isBackgroundDialogOpen, setIsBackgroundDialogOpen] = useState(false);
  const [campaign, setCampaign] = useState({
    programId: "",
    themeId: "",
    name: "",
    subtitle: "",
    background: "",
    themeOpacity: 0,
  });
  const [programs, setPrograms] = useState([]);
  const [themes, setThemes] = useState(themesData);
  const [theme, setTheme] = useState<any>();
  const [isWorking, setIsWorking] = useState(false);
  const handleDownload = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        width: 540, // Set the desired width (half of 1080)
        height: 960, // Set the desired height (half of 1920)
        scale: 2,
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
      setIsWorking(true);

      fetch(`/api/generate?programId=${campaign.programId}`)
        .then((response) => response.json())
        .then((data: any) => {
          setTheme(themes[0]);
          setCampaign((prevCampaign) => ({
            ...prevCampaign,
            name: data.llm.title,
            subtitle: data.llm.subtitle,
            background: data.backgroundImageUrl,
            themeId: themes[0].id.toString(),
            themeOpacity: themes[0].defaultOpacity,
          }));
          setIsWorking(false);
        })
        .catch((error) => console.error("Error generating content:", error));
    }

    onClose();
  }, [campaign.programId, themes, setCampaign]);

  return (
    <>
      <Flex>
        <Flex
          width={300}
          bg={"#fffaf4"}
          height={"100vh"}
          direction={"column"}
          paddingX={4}
          paddingY={6}
          borderRight={"1px solid #ffefdc"}
        >
          <FormControl display={"flex"} flexDirection={"column"}>
            <FormLabel>Program:</FormLabel>
            <select
              onChange={(e) => {
                handleGenerate();
                setCampaign((prevCampaign) => ({
                  ...prevCampaign,
                  programId: e.target.value,
                }));
              }}
              value={campaign.programId}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              {/* <option value="">Select an option</option> */}
              {programs.map((program: any) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
            <Button
              ref={cancelRef}
              colorScheme="purple"
              onClick={handleGenerate}
              ml={3}
              disabled={!campaign.programId}
              marginTop={3}
              marginBottom={6}
              alignSelf={"center"}
            >
              Ask AI
              <BsStars size={20} style={{ marginLeft: "7px" }} />
            </Button>
          </FormControl>
          <hr />
          <FormControl>
            <FormLabel>Theme:</FormLabel>
            <select
              onChange={(e) => {
                const _theme = themes.find(
                  (theme: any) =>
                    theme.id.toString() === e.target.value.toString()
                );
                if (_theme) {
                  setCampaign((prevCampaign) => ({
                    ...prevCampaign,
                    themeId: _theme.id.toString(),
                    themeOpacity: _theme.defaultOpacity,
                  }));
                  setTheme(_theme);
                }
              }}
              value={campaign.themeId}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              {/* <option value="">Select an option</option> */}
              {themes.map((theme: any) => (
                <option key={theme.id} value={theme.id}>
                  {theme.label}
                </option>
              ))}
            </select>
          </FormControl>

          <FormControl>
            <FormLabel>Opacity:</FormLabel>
            <Slider
              aria-label="slider-ex-2"
              colorScheme="pink"
              value={campaign.themeOpacity * 100}
              min={0}
              max={100}
              onChange={(val) => {
                setCampaign((prevCampaign) => ({
                  ...prevCampaign,
                  themeOpacity: val / 100,
                }));
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>

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
        <Flex
          flex={1}
          direction={"column"}
          // alignItems={"center"}
          // border={"1px solid blue"}
          position={"relative"}
          width={"calc(100% - 600px)"}
          height={"100vh"}
        >
          <Flex
            direction={"row"}
            marginTop={"10px"}
            marginBottom={"12px"}
            width={"100%"}
            padding={"0 20px"}
            justify={"center"}
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
          <Flex
            overflowX={"scroll"}
            // border={"1px solid red"}
            direction={"column"}
            padding={"20px"}
            alignItems={"center"}
            // alignItems={"center"}
          >
            <div
              ref={canvasRef}
              style={{
                backgroundImage: `url(${campaign.background})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "960px", // Half height
                width: "540px", // Half width
                position: "relative",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                padding: "40px 30px",
                // padding: "20px",
                // display: "none",
              }}
            >
              <div
                style={{
                  backgroundColor: theme?.color,
                  height: "100%",
                  width: "100%",
                  opacity: campaign.themeOpacity,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              ></div>
              <div
                style={{
                  position: "relative",
                  fontSize: "60px",
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
                  fontSize: "30px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {campaign.subtitle}
              </div>
            </div>
          </Flex>
        </Flex>
        <Flex
          width={300}
          bg={"#fffaf4"}
          height={"100vh"}
          alignItems={"start"}
          paddingX={4}
          paddingY={6}
          borderLeft={"1px solid #ffefdc"}
        >
          <Button onClick={handleDownload} colorScheme="purple">
            Download
          </Button>
          {/* <label>
            <textarea defaultValue={externalLink}></textarea>
          </label> */}
        </Flex>
      </Flex>
      <AlertDialog
        isOpen={isAlertDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Campaign
            </AlertDialogHeader>

            <AlertDialogBody>
              Select a program and let <strong>AI</strong> generate an initial
              campaign model, which you can <strong>customize</strong> later to
              suit your cause.
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
                  marginTop: "10px",
                }}
              >
                <option value="">Program</option>
                {programs.map((program: any) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                colorScheme="purple"
                onClick={handleGenerate}
                ml={3}
                disabled={!campaign.programId}
              >
                Ask AI
                <BsStars size={20} style={{ marginLeft: "7px" }} />
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {isWorking && (
        <AlertDialog
          isOpen={true}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <AlertDialogOverlay>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
            >
              Working
            </Flex>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
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
