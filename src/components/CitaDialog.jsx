import { Avatar, Button, Card, Dialog, Portal } from "@chakra-ui/react";

export default function CitaDialog({ setOpenDialogue, data }) {
    
    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    py={"3rem"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {/* <Dialog.Header>
                      <Dialog.Title>Dialog Title</Dialog.Title>
                  </Dialog.Header> */}
                    <Dialog.Body>
                        <Card.Root>
                            <Card.Body gap="4">
                                <Avatar.Root size="lg" shape="rounded">
                                    <Avatar.Image src="https://picsum.photos/200/300" />
                                    <Avatar.Fallback name="Nue Camp" />
                                </Avatar.Root>
                                {/* <Card.Title mt="2">{data.title}</Card.Title>
                                <Card.Description>
                                    <b>Inicia:</b> {data.start}
                                </Card.Description>
                                <Card.Description>
                                    <b>Termina:</b> {data.end}
                                </Card.Description> */}
                            </Card.Body>
                            <Card.Footer justifyContent="flex-end">
                                {/* <Button variant="outline">Cerrar</Button> */}
                                <Button
                                    onClick={() => {
                                        setOpenDialogue(false);
                                    }}
                                >
                                    Cerrar
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    );
}