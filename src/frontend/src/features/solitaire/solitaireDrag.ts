import { DragPayload, Selection } from './solitaireTypes';

const DRAG_DATA_TYPE = 'application/x-solitaire-card';

export function setDragData(event: React.DragEvent, payload: DragPayload): void {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify(payload));
}

export function getDragData(event: React.DragEvent): DragPayload | null {
  try {
    const data = event.dataTransfer.getData(DRAG_DATA_TYPE);
    if (!data) return null;
    
    const payload = JSON.parse(data) as DragPayload;
    
    // Validate payload structure
    if (!payload.type || (payload.type !== 'waste' && payload.type !== 'foundation' && payload.type !== 'tableau')) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export function dragPayloadToSelection(payload: DragPayload): Selection {
  return {
    type: payload.type,
    index: payload.index,
    cardIndex: payload.cardIndex,
  };
}
