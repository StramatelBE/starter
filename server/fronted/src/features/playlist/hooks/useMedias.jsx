import { useCallback } from "react";
import MediaService from "../api/mediaService";
import usePlaylists from "../hooks/usePlaylists";
import selectedPlaylistStore from "../stores/selectedPlaylistStore";

function useMedia() {
  const { getPlaylistById } = usePlaylists();
  const { setSelectedPlaylist, selectedPlaylist } = selectedPlaylistStore();
  const deleteMedia = useCallback(
    async (mediaId, playlistId) => {
      try {
        await MediaService.deleteMedia(mediaId);
        getPlaylistById(playlistId);
      } catch (error) {
        console.error("Failed to delete media:", error);
      }
    },
    [getPlaylistById]
  );

  const uploadMedia = useCallback(
    async (fileData, playlistId) => {
      try {
        await MediaService.uploadFile(fileData, playlistId);
        getPlaylistById(playlistId);
      } catch (error) {
        console.error("Failed to upload media:", error);
      }
    },
    [getPlaylistById]
  );

  const updateMedia = useCallback(
    async (e, media) => {
      try {
        let duration = parseInt(e.target.value, 10);
        if (isNaN(duration)) {
          duration = 0;
        }
        const updatedMedia = {
          ...media,
          duration: duration,
        };
        await MediaService.updateMedia(updatedMedia);
        const updatedPlaylist = {
          ...selectedPlaylist,
          medias: selectedPlaylist.medias.map((m) =>
            m.id === media.id ? updatedMedia : m
          ),
        };
        setSelectedPlaylist(updatedPlaylist);
      } catch (error) {
        console.error("Failed to update media:", error);
      }
    },
    [selectedPlaylist, setSelectedPlaylist]
  );

  return {
    deleteMedia,
    uploadMedia,
    updateMedia,
  };
}

export default useMedia;
