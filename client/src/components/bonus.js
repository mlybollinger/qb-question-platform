

export const PointMarker = ({attributes, children, points, difficulty}) => {

  return (
    <span {...attributes}>

    <span contentEditable={ false}>
      {'[' + String(points) + difficulty + '] '}
    </span>
          { children }

    </span>

  )
}