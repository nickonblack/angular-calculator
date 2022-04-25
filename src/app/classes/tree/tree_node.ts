export class BinaryTree<U> {

    private root: INode<U> | undefined


    createNewNode = (value: U): INode<U> => {
      return {
        value,
        left: null,
        right: null,
      }
    }
  
    insert = (value: U) => {
      const currentNode = this.createNewNode(value)
      if (!this.root) {
        this.root = currentNode
      } else {
        this.insertIntoCurrentNode(currentNode)
      }
      return this
    }
  
    private insertIntoCurrentNode = (currentNode: INode<U>) => {
      const { value } = currentNode
      const traverse = (node: INode<U>) => {
        if (value > node.value) {
          if (!node.right) {
            node.right = currentNode
          } else traverse(node.right)
        } else if (value < node.value) {
          if (!node.left) {
            node.left = currentNode
          } else traverse(node.left)
        }
      }
      traverse(this.root as INode<U>)
    }
}

interface INode<U> {
    value: U
    left: INode<U> | null
    right: INode<U> | null
}