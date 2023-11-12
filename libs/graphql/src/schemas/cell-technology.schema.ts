import gql from 'graphql-tag';

export const cellTechnologyTypedef = gql`
  """
  @link https://en.wikipedia.org/wiki/List_of_wireless_network_technologies
  """
  enum CellTechnology {
    """
    2G
    """
    GSM

    """
    3G
    """
    WCDMA

    """
    4G
    """
    LTE

    """
    5G
    """
    NR

    """
    it might be wifi calling, VOIP
    """
    INTERNET

    """
    Unknown due with cell technology hardware
    """
    UNKNOWN
  }
`;
