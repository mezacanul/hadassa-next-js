import { Dialog } from "@ark-ui/react";
import { Button, Card, Portal, VStack } from "@chakra-ui/react";

export default function AgendarCitaModal({setOpenDialogue, selectedDate, data}) {
  return (
      <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
              <Dialog.Content py={"3rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                  <Dialog.Header>
                      <Dialog.Title>Agendar Nueva Cita</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    {/* <VStack align={"start"}>
                        <p><b>Fecha:</b> {selectedDate}</p>
                        <p><b>Servicio:</b> TEST</p>
                        <p><b>Lashista:</b> TEST</p>
                        <p><b>Hora:</b> TEST</p>
                        <Button onClick={()=>{setOpenDialogue(false)}}>Cerrar</Button>
                    </VStack> */}
                      
                      <Card.Root>
                          <Card.Body gap="4">
                              <Card.Title mt="2">FECHA {selectedDate}</Card.Title>
                              <Card.Description><b>Servicio:</b> TEST</Card.Description>
                              <Card.Description><b>Lashista:</b> TEST</Card.Description>
                              <Card.Description><b>Hora:</b> TEST</Card.Description>
                          </Card.Body>
                          <Card.Footer justifyContent="flex-end">
                              {/* <Button variant="outline">Cerrar</Button> */}
                              <Button onClick={()=>{setOpenDialogue(false)}}>Cerrar</Button>
                          </Card.Footer>
                      </Card.Root>

                  </Dialog.Body>
              </Dialog.Content>
          </Dialog.Positioner>
      </Portal>
  );
}