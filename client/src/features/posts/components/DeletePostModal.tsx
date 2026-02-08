import { 
  Button,
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalContent, 
  ModalFooter,
} from '@/components/ui'

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeletePostModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: DeletePostModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Delete Post</ModalTitle>
      </ModalHeader>

      <ModalContent>
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed.
        </p>
      </ModalContent>

      <ModalFooter>
        <Button 
          variant="outline" 
          onClick={onClose} 
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <Button 
          variant="danger" 
          onClick={onConfirm} 
          isLoading={isLoading}
        >
          Delete Post
        </Button>
      </ModalFooter>
    </Modal>
  );
};
