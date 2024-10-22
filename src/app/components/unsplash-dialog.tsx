import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";

function UnsplashDialog({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: (imageUrl: string) => void;
  onSelect: (imageUrl: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);

  const handleSearch = async () => {
    // Fetch images from Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=HqMm_ZIV-bj1vY-_Z7s1Vnb8hoaAwq5TYuiq_aaxCQk`
    );
    const data = await response.json();
    setImages(data.results);
  };

  const handleImageSelect = (imageUrl: string) => {
    onSelect(imageUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose("")}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search Unsplash</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search for images"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch} mt={4}>
            Search
          </Button>
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
            {images.map((image: any) => (
              <GridItem key={image.id}>
                <Image
                  src={image.urls.small}
                  alt={image.description}
                  onClick={() => handleImageSelect(image.urls.small)}
                  style={{ cursor: "pointer" }}
                />
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => onClose("")}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UnsplashDialog;
