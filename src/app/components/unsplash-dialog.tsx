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
  const [page, setPage] = useState(1);

  const handleSearch = async (newSearch = false) => {
    const currentPage = newSearch ? 1 : page;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchTerm}&page=${currentPage}&client_id=HqMm_ZIV-bj1vY-_Z7s1Vnb8hoaAwq5TYuiq_aaxCQk`
    );
    const data = await response.json();
    setImages(newSearch ? data.results : [...images, ...data.results]);
    setPage(currentPage + 1);
  };

  const handleImageSelect = (imageUrl: string) => {
    onSelect(imageUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose("")} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Background</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(true);
              }
            }}
          />
          {/* <Button onClick={() => handleSearch(true)} mt={4}>
            Search
          </Button> */}
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
          {images.length > 0 && (
            <Button onClick={() => handleSearch()} mt={4}>
              Load More
            </Button>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={() => onClose("")}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UnsplashDialog;
