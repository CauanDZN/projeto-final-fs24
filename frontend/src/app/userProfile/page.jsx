"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { Trash, Pencil, X, CheckCircle } from "phosphor-react";
import { Pagination, } from '@mui/material';
import LoadingSpinCircle from "@/components/LoadSpinComponent/LoadingSpinCircle";
import ModalDeleteLink from "@/components/Modal/ModalDeleteLink";
import ModalCreateLink from "@/components/Modal/ModalCreateLink";
import CardWrapper from "@/components/CardWrapper/CardWrapper";
import normalizeUrl from "@/utils/normalizeUrl/normalizeUrl";
import API from "@/service/api";
import getUserByIdService from "@/service/users/getUserById/getUserByIdService";
import getLinkByUserIdService from "@/service/links/getLinksByUserIdServicejs/getLinkByUserIdService";
import ModalEditLink from "@/components/Modal/ModalEditLink";
import NotificationComponent from "@/components/NotificationComponent/NotificationComponent";

export default function userProfile () {
    
  const { user } = useAuth();
  const userId = user?.id;

  const [userData, setUserData] = useState({});
  const [linkData, setLinkData] = useState([]);
  const [linkId, setLinkId] = useState(null);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '', 
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  async function findUserLogged () {
    if (userId) {
      try {
        const response = await getUserByIdService(userId);
        setUserData(response);

    } catch (error) {
        console.error("Não foi possível encontrar dados do usuário", error);
    }
    }
  }

  async function fetchLinks () {
   if (userId) {
    try {
      const response = await getLinkByUserIdService(userId);
      setLinkData(response);

    } catch (error) {
      console.error("Erro ao buscar links do usuário:", error);

    } finally {
      setLoading(false);
    }
   }
  };

  useEffect(() => {
    async function initialize() {
      if (userId) {
        try {
          const token = localStorage.getItem('token');
          
          if (token) {
            API.defaults.headers.common['token'] = token;
            setAuthenticated(true);
            await findUserLogged();
            await fetchLinks();
          } else {
              throw new Error('Token ausente');
          }
  
        } catch (error) {
          console.error('Usuário não autenticado:', error);
          setAuthenticated(false);
          router.push('/'); 
        } finally {
          setLoading(false);
        }
      }
    }

    initialize();
  }, [router, userId]);

    if (!authenticated) return null;

  async function handleLogOut() {
    try {
      delete API.defaults.headers.common['token'];
      localStorage.removeItem('token');
      setSnackbar({
        open: true,
        message: (
          <div className="flex items-center gap-2">
            <CheckCircle size={18} weight="bold" className="text-green-500" />
            <span>Logout realizado com sucesso!</span>
          </div>
        ),
      });
      setAuthenticated(false);
      router.push('/');
    } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: (
            <div className="flex items-center gap-2">
              <X size={18} weight="bold" className="text-red-500" />
              <span>Erro ao fazer logOut. Tente novamente mais tarde!</span>
            </div>
          ),
        });
      
    }
  }

    const handleOpenDeleteLinkModal = (linkId) => {
        setLinkId(linkId);
        setOpenDelete(true)
    }

    const handleOpenEditModal = (linkId) => {
        setLinkId(linkId);
        setOpenEdit(true)
    }

    const handleCloseDeleteModal = () => {
        setOpenDelete(false);
        setLinkId(null);
    } 

    const handleCloseEditModal = () => {
        setOpenEdit(false);
        setLinkId(null);
    } 

    const handleCloseCreateModal = () => {
        setOpenCreate(false);
        setLinkId(null);
    } 

    const handleDeleteSuccess = async () => {
        try {
            const response = await getLinkByUserIdService(userId);
            setLinkData(response);
            alert("Link deletado com sucesso!");
            setSnackbar({
                open: true,
                message: (
                  <div className="flex items-center gap-2">
                    <X size={18} weight="bold" className="text-green-500" />
                    <span>Link deletado com sucesso!</span>
                  </div>
                ),
              });
            handleCloseDeleteModal(); 
          } catch (error) {
            console.error('Erro ao buscar link após exclusão:', error);
            setSnackbar({
                open: true,
                message: (
                  <div className="flex items-center gap-2">
                    <X size={18} weight="bold" className="text-red-500" />
                    <span>Erro ao deletar link. Tente novamente mais tarde!</span>
                  </div>
                ),
              });
            
          }
    };

    const handleEditSuccess = async () => {
        try {
            const response = await getLinkByUserIdService(userId);
            setLinkData(response);
            setSnackbar({
                open: true,
                message: (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} weight="bold" className="text-green-500" />
                    <span>Link alterado com sucesso!</span>
                  </div>
                ),
              });
            handleCloseDeleteModal(); 
          } catch (error) {
            console.error('Erro ao editar link:', error);
            setSnackbar({
                open: true,
                message: (
                  <div className="flex items-center gap-2">
                    <X size={18} weight="bold" className="text-red-500" />
                    <span>Erro ao editar link. Tente novamente mais tarde!</span>
                  </div>
                ),
              });
          }
    };

    const handleCreateSuccess = async () => {
        try {
            const response = await getLinkByUserIdService(userId);
            setLinkData(response);
            setSnackbar({
                open: true,
                message: (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} weight="bold" className="text-green-500" />
                    <span>Link criado com sucesso!</span>
                  </div>
                ),
              });
            handleCloseCreateModal(); 
          } catch (error) {
            console.error('Erro ao criar link:', error);
            setSnackbar({
                open: true,
                message: (
                  <div className="flex items-center gap-2">
                    <X size={18} weight="bold" className="text-red-500" />
                    <span>Erro ao criar link. Tente novamente mais tarde!</span>
                  </div>
                ),
              });
          }
    };

    if (loading) return <LoadingSpinCircle />;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLinks = linkData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(linkData?.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
      };


    return (
        <div className="h-full p-5">
            <header className="flex justify-between h-1/5 items-center bg-[#fff6e5] p-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-orange-600">Digital Bio</h1>
                    <button onClick={handleLogOut} className="text-gray-500 text-base hover:underline hover:cursor-pointer">Log Out</button>
                </div>
                <nav className="flex gap-3 text-lg font-semibold text-[#1e3a8a]">
                    <Link href={`/userProfile`}>
                        <p className="hover:underline cursor-pointer">Perfil</p>
                    </Link>
                    <span>|</span>
                    <Link href= {`/userLinks/${userId}`}>
                        <p className="hover:underline cursor-pointer">Meus links</p>
                    </Link>
                </nav>
            </header> 

            <CardWrapper>

                <div className="bg-white h-4/5 flex flex-col justify-center items-center">
                    <div className="pt-6 text-center mb-4">
                        <h2>Seja bem vindo(a) {userData.name}</h2>
                        <p className="text-gray-400">{userData.username}</p>
                    </div>

                    <div className="w-full flex flex-col justify-center items-center">
                        
                        <button 
                            className="bg-orange-500 text-white px-8 py-3 rounded-full mb-4"
                            onClick={() => setOpenCreate(true)}
                        >
                            ADICIONAR NOVO LINK
                        </button>
                    </div>


                    <div className="flex flex-col justify-center items-center rounded-md mt-4 shadow-md w-[60vw] p-3 bg-[#fff6e5]">
                        {currentLinks?.length === 0 ? (
                            <p>Você ainda não possui nenhum link cadastrado.</p>
                        ) : (
                            currentLinks?.map((link) => {
                                const formattedUrl = normalizeUrl(link.url);

                                return (
                                    <div key={link.id} className="flex justify-between border-[1px] border-gray-400 mb-6 
                                    py-5 px-4 w-[60%]">
                                        <div>         
                                            <a
                                                target="_blank"
                                                href={formattedUrl}
                                                rel="noopener noreferrer"
                                            >
                                                <p className="text-[#1e3a8a] font-medium">{link.title}</p>
                                            </a>
                                        </div>

                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => handleOpenEditModal(link.id)}>
                                                <Pencil size={25} className="text-[#1e3a8a]" />
                                            </button>
                                            <button onClick={() => handleOpenDeleteLinkModal(link.id)} >
                                                <Trash size={25} className="text-[#1e3a8a]" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <Pagination
                            sx={{ marginTop: '10px' }}
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                    <ModalCreateLink
                        open={openCreate}
                        setOpen={setOpenCreate}
                        userData={userData}
                        handleClose={handleCloseCreateModal}
                        handleCreateSuccess={handleCreateSuccess}
                    />

                    <ModalEditLink
                        open={openEdit}
                        setOpen={setOpenEdit}
                        userData={userData}
                        linkData={linkData}
                        linkId={linkId}
                        setLinkData={setLinkData}
                        handleClose={handleCloseEditModal}
                        handleEditSuccess={handleEditSuccess}
                    />

                    <ModalDeleteLink
                        open={openDelete}
                        setOpen={setOpenDelete}
                        linkId={linkId}
                        handleClose={handleCloseDeleteModal}
                        handleDeleteSuccess={handleDeleteSuccess}
                    />

                    <NotificationComponent
                        open={snackbar.open}
                        onClose={handleClose}
                        message={snackbar.message}
                        onClick={handleClose}
                    />
            </div>
            
            { loading && <LoadingSpinCircle /> }
            </CardWrapper>    
        </div>
    )
}