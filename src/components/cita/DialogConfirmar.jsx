import { Button, CloseButton, Dialog, Heading, Portal } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function DialogConfirmar({
    open, 
    setOpen,
    title,
    onConfirm = null,
    confirmText = null,
    onCancel = null,
    cancelText = null,
    children
}) {
    const handleCancel = ()=>{
        if(onCancel){
            onCancel()
        }
        setOpen(false)
    }
    return (
        <Dialog.Root size={"md"} lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {children}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant={"outline"} colorPalette={"red"} onClick={handleCancel}>{cancelText ? cancelText : "Cancelar"}</Button>
                            </Dialog.ActionTrigger>
                            <Button bg={"pink.500"} onClick={onConfirm}>{confirmText ? confirmText : "Confirmar"}</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
